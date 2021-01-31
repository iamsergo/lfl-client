export const nowLessThen = (date : number[], time : number[]) : boolean => {
  const now = Date.now()

  const [d,m,y] = date
  const [h,min] = time
  const gameTime = new Date(y,m-1,d,h,min).getTime()

  return now <= gameTime
}