export const errorHandler = (e) => ({
  data: e?.response?.data ? e?.response?.data.message : e.message,
  success: false,
})

export const successHandler = (data) => ({
  data,
  success: true,
})
