// VietQR utility for generating payment QR codes
export const generateVietQR = (
  accountNo: string,
  accountName: string,
  amount: number,
  description: string,
  bankCode: string = 'MB'
): string => {
  // VietQR API endpoint
  const baseUrl = 'https://img.vietqr.io/image'
  
  // Encode parameters for URL
  const params = new URLSearchParams({
    accountNo,
    accountName,
    amount: amount.toString(),
    description,
    bankCode
  })
  
  return `${baseUrl}/${bankCode}-${accountNo}-compact2.jpg?${params.toString()}`
}

// Bank account information
export const BANK_INFO = {
  bankCode: 'MB',
  accountNo: '222234567868',
  accountName: 'VU DANG KHOA'
}