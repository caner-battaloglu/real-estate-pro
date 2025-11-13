type SearchableAddress = {
  line1?: string
  line2?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

type SearchableProperty = {
  title?: string
  description?: string
  type?: string
  price?: number
  location?: string
  address?: SearchableAddress
}

const splitWords = (value: string) =>
  value
    .split(/[\s,./-]+/)
    .map((word) => word.trim())
    .filter(Boolean)

const matchesStringValue = (rawValue: string, token: string) => {
  const value = rawValue.toLowerCase()

  if (token.length <= 3) {
    if (value.startsWith(token)) {
      return true
    }

    return splitWords(value).some((word) => word.startsWith(token))
  }

  return value.includes(token)
}

const matchesNumberValue = (rawValue: number, token: string) => {
  const value = rawValue.toString().toLowerCase()

  if (token.length <= 3) {
    return value.startsWith(token)
  }

  return value.includes(token)
}

export const getSearchTokens = (query: string) => {
  return query
    .toLowerCase()
    .split(/[\s,]+/)
    .map((token) => token.trim())
    .filter((token) => token && token !== "or")
}

export const propertyMatchesTokens = (property: SearchableProperty, tokens: string[]) => {
  if (!tokens.length) {
    return false
  }

  const stringValues: string[] = [
    property.title,
    property.description,
    property.type,
    property.location,
    property.address?.line1,
    property.address?.line2,
    property.address?.city,
    property.address?.state,
    property.address?.country,
    property.address?.postalCode,
  ].filter((value): value is string => typeof value === "string" && value.trim().length > 0)

  const numericValues: number[] = [
    property.price,
  ].filter((value): value is number => typeof value === "number" && !Number.isNaN(value))

  return tokens.some((token) => {
    const normalizedToken = token.toLowerCase()

    if (stringValues.some((value) => matchesStringValue(value, normalizedToken))) {
      return true
    }

    return numericValues.some((value) => matchesNumberValue(value, normalizedToken))
  })
}

export const propertyMatchesQuery = (property: SearchableProperty, query: string) => {
  const tokens = getSearchTokens(query)
  return propertyMatchesTokens(property, tokens)
}

