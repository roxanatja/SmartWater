export interface Client {
    _id: string,
    code: String,
    user: String,
    storeImage: String,
    fullName: String,
    phoneNumber: String,
    address: String,
    comment: String,
    ciFrontImage: String,
    ciBackImage: String,
    zone: String,
    district: String,
    location: {
      latitude: String,
      longitude: String
    },
    hasOrder: Boolean,
    hasLoan: Boolean,
    hasContract: Boolean,
    renewInDays: Number,
    renewDate: String,
    isClient: Boolean,
    contracts: [],
    created: String,
    updated: String,
    lastSale: String,
    hasExpiredContract: Boolean
    credit: Number
}