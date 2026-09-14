import { describe, expect, it } from "vitest"
import { activeMonthly, progress, totals } from "./utils"

describe("financial rules", () => {
  it("calculates income, expenses, balance and savings rate in cents", () => {
    const result = totals([{ id:"1", description:"entrada", amount:10000, type:"income", categoryId:"Salário", date:"2026-01-01", status:"received", createdAt:"", updatedAt:"" }, { id:"2", description:"saída", amount:2500, type:"expense", categoryId:"Casa", date:"2026-01-01", status:"paid", createdAt:"", updatedAt:"" }])
    expect(result).toMatchObject({ income:10000, expenses:2500, balance:7500, savings:7500, rate:75 })
  })
  it("caps goal progress at 100%", () => expect(progress({ id:"g",name:"Meta",targetAmount:100,currentAmount:160,status:"active",createdAt:"",updatedAt:"" })).toBe(100))
  it("converts yearly subscriptions to a monthly equivalent", () => expect(activeMonthly([{id:"s",name:"Anual",amount:12000,billingDay:1,frequency:"yearly",active:true,nextBillingDate:"",createdAt:"",updatedAt:""}])).toBe(1000))
})
