import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { resolveMediaUrl } from '@/lib/media'
import { MultiAutocompleteInput } from '@/components/search/MultiAutocompleteInput'

const PRICE_OPTIONS = [
  { value: 'cheap', label: '$ (Cheap)' },
  { value: 'moderate', label: '$$ (Moderate)' },
  { value: 'expensive', label: '$$$ (Expensive)' },
  { value: 'very_expensive', label: '$$$$ (Very Expensive)' },
] as const

const PAGE_SIZE = 9
const CANDIDATE_LIMIT = 120

type CategoryDoc = {
  id: string
  name: string
  slug: string
}

type ReviewDoc = {
  id: string
  title: string
  description: string
  slug: string
  coverImage?: unknown
  publishedDate?: string
  location?: {
    name?: string
  }
  details?: {
    priceRange?: string
    tags?: Array<{ tag?: string }>
  }
  category?: Array<{ id?: string; name?: string; slug?: string } | string>
  content?: unknown
  searchText?: string
}

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
    category?: string | string[]
    price?: string
    tag?: string | string[]
    location?: string
    page?: string
  }>
}

const normalize = (value: string): string => value.toLowerCase().trim()

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const tokenize = (value: string): string[] =>
  normalize(value)
    .split(/\s+/)
    .filter((token) => token.length > 1)

const getWords = (value: string): string[] =>
  normalize(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

const levenshtein = (a: string, b: string): number => {
  const rows = a.length + 1
  const cols = b.length + 1
  const dp = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }

  return dp[rows - 1][cols - 1]
}

const fuzzyRatio = (a: string, b: string): number => {
  const longest = Math.max(a.length, b.length)
  if (longest === 0) return 1
  return 1 - levenshtein(a, b) / longest
}

const highlightText = (text: string, tokens: string[]) => {
  if (!tokens.length) return text
  const pattern = new RegExp(`(${tokens.map(escapeRegex).join('|')})`, 'gi')
  const parts = text.split(pattern)

  return parts.map((part, index) =>
    tokens.some((token) => part.toLowerCase() === token.toLowerCase()) ? (
      <mark key={`${part}-${index}`} className="bg-yellow-200/80 px-0.5 rounded-sm">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  )
}

const extractRichTextText = (value: unknown): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(extractRichTextText).filter(Boolean).join(' ')
  if (typeof value !== 'object') return ''

  const node = value as {
    text?: unknown
    children?: unknown
    root?: unknown
    fields?: unknown
    caption?: unknown
  }

  const chunks: string[] = []
  if (typeof node.text === 'string') chunks.push(node.text)
  if (node.children) chunks.push(extractRichTextText(node.children))
  if (node.root) chunks.push(extractRichTextText(node.root))
  if (node.fields) chunks.push(extractRichTextText(node.fields))
  if (typeof node.caption === 'string') chunks.push(node.caption)

  return chunks.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

const buildSnippet = (text: string, queryTokens: string[]): string => {
  const cleanText = text.replace(/\s+/g, ' ').trim()
  if (!cleanText) return ''
  if (!queryTokens.length) return cleanText.slice(0, 180)

  const lowered = cleanText.toLowerCase()
  const firstHitIndex = queryTokens.reduce((best, token) => {
    const index = lowered.indexOf(token.toLowerCase())
    if (index === -1) return best
    if (best === -1) return index
    return Math.min(best, index)
  }, -1)

  if (firstHitIndex === -1) return cleanText.slice(0, 180)

  const start = Math.max(0, firstHitIndex - 70)
  const end = Math.min(cleanText.length, firstHitIndex + 120)
  const snippet = cleanText.slice(start, end)
  const prefix = start > 0 ? '... ' : ''
  const suffix = end < cleanText.length ? ' ...' : ''
  return `${prefix}${snippet}${suffix}`
}

const scoreReview = (review: ReviewDoc, query: string): number => {
  const normalizedQuery = normalize(query)
  const queryTokens = tokenize(query)
  if (!normalizedQuery || queryTokens.length === 0) return 0

  const title = normalize(review.title || '')
  const description = normalize(review.description || '')
  const locationName = normalize(review.location?.name || '')
  const contentText = normalize(review.searchText || extractRichTextText(review.content))
  const tags = (review.details?.tags || [])
    .map((item) => normalize(item?.tag || ''))
    .filter(Boolean)
  const categoryNames = (review.category || [])
    .map((item) => (typeof item === 'string' ? '' : normalize(item?.name || '')))
    .filter(Boolean)

  let score = 0

  if (title === normalizedQuery) score += 1000
  if (title.startsWith(normalizedQuery)) score += 350
  if (title.includes(normalizedQuery)) score += 220
  if (description.includes(normalizedQuery)) score += 110
  if (contentText.includes(normalizedQuery)) score += 95
  if (locationName.includes(normalizedQuery)) score += 100
  if (categoryNames.some((name) => name.includes(normalizedQuery))) score += 90
  if (tags.some((tag) => tag.includes(normalizedQuery))) score += 120

  for (const token of queryTokens) {
    if (title.includes(token)) score += 110
    if (description.includes(token)) score += 40
    if (contentText.includes(token)) score += 30
    if (locationName.includes(token)) score += 35
    if (categoryNames.some((name) => name.includes(token))) score += 30
    if (tags.some((tag) => tag.includes(token))) score += 45
  }

  const candidateWords = [
    ...getWords(title),
    ...getWords(description).slice(0, 30),
    ...getWords(contentText).slice(0, 70),
    ...tags.flatMap((tag) => getWords(tag)),
    ...categoryNames.flatMap((name) => getWords(name)),
    ...getWords(locationName),
  ]

  let bestFuzzy = 0
  for (const token of queryTokens) {
    for (const word of candidateWords) {
      if (Math.abs(word.length - token.length) > 3) continue
      const ratio = fuzzyRatio(token, word)
      if (ratio > bestFuzzy) bestFuzzy = ratio
    }
  }

  if (bestFuzzy >= 0.92) score += 70
  else if (bestFuzzy >= 0.84) score += 40

  return score
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category, price, tag, location, page } = await searchParams
  const query = q?.trim() ?? ''
  const selectedTags = (Array.isArray(tag) ? tag : tag ? [tag] : [])
    .flatMap((item) => item.split(','))
    .map((item) => item.trim())
    .filter(Boolean)
  const selectedLocation = location?.trim() ?? ''
  const selectedCategorySlugs = (Array.isArray(category) ? category : category ? [category] : [])
    .flatMap((item) => item.split(','))
    .map((item) => item.trim())
    .filter(Boolean)
  const selectedPrice = price?.trim() ?? ''
  const currentPage = Math.max(1, Number.parseInt(page || '1', 10) || 1)

  const payload = await getPayload({ config })
  const categoriesData = await payload.find({
    collection: 'categories',
    sort: 'name',
    limit: 100,
  })

  const categories = categoriesData.docs as CategoryDoc[]
  const selectedCategoryIds = categories
    .filter((item) => selectedCategorySlugs.includes(item.slug))
    .map((item) => item.id)

  const whereAndClauses: Array<Record<string, unknown>> = []

  if (selectedCategoryIds.length > 0) {
    whereAndClauses.push({
      category: {
        in: selectedCategoryIds,
      },
    })
  }

  if (selectedPrice) {
    whereAndClauses.push({
      'details.priceRange': {
        equals: selectedPrice,
      },
    })
  }

  if (query.length > 0) {
    whereAndClauses.push({
      or: [
        {
          title: {
            like: query,
          },
        },
        {
          description: {
            like: query,
          },
        },
        {
          'location.name': {
            like: query,
          },
        },
        {
          searchText: {
            like: query,
          },
        },
      ],
    })
  }

  if (selectedTags.length > 0) {
    whereAndClauses.push({
      and: selectedTags.map((selectedTag) => ({
        or: [
          {
            'details.tags.tag': {
              like: selectedTag,
            },
          },
          {
            searchText: {
              like: selectedTag,
            },
          },
        ],
      })),
    })
  }

  if (selectedLocation.length > 0) {
    whereAndClauses.push({
      'location.name': {
        like: selectedLocation,
      },
    })
  }

  const reviewsData = await payload.find({
    collection: 'reviews',
    limit: CANDIDATE_LIMIT,
    sort: '-publishedDate',
    depth: 1,
    ...(whereAndClauses.length > 0
      ? {
          where: {
            and: whereAndClauses,
          },
        }
      : {}),
  })

  const reviews = reviewsData.docs as ReviewDoc[]
  const availableTags = Array.from(
    new Set(
      reviews
        .flatMap((review) => review.details?.tags || [])
        .map((item) => item?.tag?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((a, b) => a.localeCompare(b))

  const queryTokens = tokenize([query, selectedTags.join(' '), selectedLocation].filter(Boolean).join(' '))

  const filteredAndRanked = reviews
    .map((review) => ({
      review,
      score: query.length > 0 ? scoreReview(review, query) : 1,
    }))
    .filter((item) => (query.length > 0 ? item.score > 0 : true))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      const dateA = new Date(a.review.publishedDate || 0).getTime()
      const dateB = new Date(b.review.publishedDate || 0).getTime()
      return dateB - dateA
    })

  const totalResults = filteredAndRanked.length
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageResults = filteredAndRanked.slice(pageStart, pageStart + PAGE_SIZE)

  const createPageHref = (targetPage: number): string => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    for (const slug of selectedCategorySlugs) params.append('category', slug)
    if (selectedPrice) params.set('price', selectedPrice)
    for (const selectedTag of selectedTags) params.append('tag', selectedTag)
    if (selectedLocation) params.set('location', selectedLocation)
    if (targetPage > 1) params.set('page', String(targetPage))
    const queryString = params.toString()
    return queryString ? `/search?${queryString}` : '/search'
  }

  const hasActiveFilters =
    query.length > 0 ||
    selectedCategorySlugs.length > 0 ||
    selectedPrice.length > 0 ||
    selectedTags.length > 0 ||
    selectedLocation.length > 0

  const filterControls = (
    <>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Filters</h2>
        <p className="text-xs text-gray-500 mt-1">Refine results</p>
      </div>

      <div>
        <label htmlFor="search-query" className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-2">
          Search
        </label>
        <input
          id="search-query"
          name="q"
          type="text"
          defaultValue={query}
          placeholder="Dish, restaurant, or keyword"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="search-location" className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-2">
          Location
        </label>
        <input
          id="search-location"
          name="location"
          type="text"
          defaultValue={selectedLocation}
          placeholder="e.g. Westlands"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none"
        />
      </div>

      <div>
        <MultiAutocompleteInput
          name="tag"
          label="Tags"
          placeholder="Type to find tags"
          options={availableTags.map((item) => ({ value: item, label: item }))}
          selectedValues={selectedTags}
        />
      </div>

      <div>
        <label htmlFor="search-price" className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-2">
          Price
        </label>
        <select
          id="search-price"
          name="price"
          defaultValue={selectedPrice}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none"
        >
          <option value="">All price ranges</option>
          {PRICE_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <MultiAutocompleteInput
          name="category"
          label="Categories"
          placeholder="Type to find categories"
          options={categories.map((item) => ({ value: item.slug, label: item.name }))}
          selectedValues={selectedCategorySlugs}
        />
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans">
      <Header />

      <section className="relative h-[30vh] bg-black flex items-center justify-center text-white">
        <h1 className="text-4xl font-light tracking-wide font-sans text-gray-200">Search</h1>
      </section>

      <section className="py-12 px-6 container mx-auto max-w-7xl">
        <div className="lg:hidden mb-4">
          <input id="mobile-filter-drawer" type="checkbox" className="peer sr-only" />
          <label
            htmlFor="mobile-filter-drawer"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Open Filters
          </label>
          <div className="pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity duration-300 peer-checked:pointer-events-auto peer-checked:opacity-100">
            <label htmlFor="mobile-filter-drawer" className="absolute inset-0 bg-black/40" />
            <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Filter Results</h3>
                <label
                  htmlFor="mobile-filter-drawer"
                  className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Close
                </label>
              </div>

              <form action="/search" method="get" className="space-y-5">
                {filterControls}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
                  >
                    Apply Filters
                  </button>
                  <Link
                    href="/search"
                    className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Reset
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <form action="/search" method="get" className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm space-y-5 lg:sticky lg:top-24">
              {filterControls}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
                >
                  Apply Filters
                </button>
                <Link
                  href="/search"
                  className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Reset
                </Link>
              </div>
            </form>
          </aside>

          <div className="lg:col-span-8 xl:col-span-9">
            {!hasActiveFilters && (
              <div className="bg-white border border-gray-200 rounded-sm p-10 text-center text-gray-600">
                Use the filters on the left to discover reviews.
              </div>
            )}

            {hasActiveFilters && (
              <>
                <div className="bg-white border border-gray-200 rounded-sm p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    {totalResults} result{totalResults === 1 ? '' : 's'}
                    {query.length > 0 ? ` for "${query}"` : ''}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {query && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Query: {query}</span>}
                    {selectedLocation && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Location: {selectedLocation}</span>}
                    {selectedTags.map((selectedTag) => (
                      <span key={selectedTag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Tag: {selectedTag}
                      </span>
                    ))}
                    {selectedPrice && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Price: {PRICE_OPTIONS.find((item) => item.value === selectedPrice)?.label || selectedPrice}
                      </span>
                    )}
                    {selectedCategorySlugs.map((slug) => (
                      <span key={slug} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Category: {categories.find((item) => item.slug === slug)?.name || slug}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
            {hasActiveFilters && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pageResults.map(({ review }) => {
                    const imageUrl = resolveMediaUrl(review.coverImage)
                    const contentText = review.searchText || extractRichTextText(review.content)
                    const contentSnippet = buildSnippet(contentText, queryTokens)
                    const tags = (review.details?.tags || [])
                      .map((item) => item?.tag?.trim())
                      .filter(Boolean) as string[]

                    return (
                      <Link
                        href={`/reviews/${review.slug}`}
                        key={review.id}
                        className="group bg-white block h-full flex flex-col border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={review.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                              <span className="text-xs uppercase tracking-widest">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-base font-bold text-gray-900 mb-2 font-sans">
                            {highlightText(review.title, queryTokens)}
                          </h3>
                          <p className="text-gray-600 text-xs leading-relaxed font-light line-clamp-4">
                            {highlightText(review.description, queryTokens)}
                          </p>
                          {contentSnippet && (
                            <p className="mt-2 text-gray-500 text-xs leading-relaxed font-light line-clamp-3">
                              {highlightText(contentSnippet, queryTokens)}
                            </p>
                          )}
                          {tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {tags.slice(0, 3).map((itemTag) => (
                                <span key={`${review.id}-${itemTag}`} className="text-[10px] bg-gray-100 px-2 py-1 rounded">
                                  {highlightText(itemTag, queryTokens)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {totalResults > 0 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <Link
                      href={createPageHref(Math.max(1, safePage - 1))}
                      className={`rounded border px-3 py-2 text-xs ${safePage === 1 ? 'pointer-events-none text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      Previous
                    </Link>
                    <span className="text-xs text-gray-600">
                      Page {safePage} of {totalPages}
                    </span>
                    <Link
                      href={createPageHref(Math.min(totalPages, safePage + 1))}
                      className={`rounded border px-3 py-2 text-xs ${safePage >= totalPages ? 'pointer-events-none text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      Next
                    </Link>
                  </div>
                )}

                {totalResults === 0 && (
                  <div className="bg-white border border-gray-200 rounded-sm p-10 text-center text-gray-500">
                    No reviews found. Try different filters.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
