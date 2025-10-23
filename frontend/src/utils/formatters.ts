/**
 * Format phone number to hide middle 4 digits
 * Example: 0123456789 -> 0123***789
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // If less than 7 digits, don't mask (too short)
  if (digits.length < 7) return phone
  
  // Show first 4 and last 3 digits, mask the middle
  const start = digits.slice(0, 4)
  const end = digits.slice(-3)
  const middle = '*'.repeat(Math.min(digits.length - 7, 4)) // Max 4 asterisks
  
  return `${start}${middle}${end}`
}

/**
 * Decode Base64 string with UTF-8 support (handles Vietnamese characters)
 */
export const decodeBase64UTF8 = (str: string): string => {
  try {
    // Decode base64 to binary string
    const binaryString = atob(str)
    
    // Convert binary string to UTF-8
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    // Decode UTF-8 bytes to string
    return new TextDecoder('utf-8').decode(bytes)
  } catch (e) {
    console.error('Failed to decode base64 UTF-8:', e)
    return str
  }
}

/**
 * Format currency to VND
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount)
}

/**
 * Format order ID with "AA" prefix
 * Extracts numeric part from order ID and displays as AA followed by numbers
 * Example: "abc-123456" -> "AA123456"
 * Example: "ORDER-1234567890123" -> "AA1234567890123" (shows all digits)
 */
export const formatOrderId = (orderId: string): string => {
  if (!orderId) return ''
  
  // If already has AA prefix, return as-is
  if (orderId.startsWith('AA')) return orderId
  
  // Extract all digits from the order ID
  const digits = orderId.replace(/\D/g, '')
  
  // If no digits found, return original
  if (!digits) return orderId
  
  // Return all digits with AA prefix (no truncation)
  return `AA${digits}`
}
