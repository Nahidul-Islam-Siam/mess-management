# Mess Management System — Full Technical Documentation (Redux + Next.js + TypeScript)

আপনার দেওয়া তথ্য অনুযায়ী এখানে সম্পূর্ণ ডিটেইলড ও স্ট্রাকচার্ড ডকুমেন্টেশন প্রস্তুত করা হলো। আপনি Redux + Next.js + TypeScript ব্যবহার করছেন, তাই সিস্টেম আর্কিটেকচার এই স্ট্যাকে অপ্টিমাইজ করা হয়েছে।

---

# ✅ 1. Project Overview

ঢাকার ম্যাচ সিস্টেমে প্রতিদিনের মিল, বাজার খরচ, সদস্যভেদে বিল শেয়ার, খালাখরচ এবং মাস শেষে হিসাব করা একটি জটিল প্রক্রিয়া। এই সিস্টেমটি সম্পূর্ণ ডিজিটাল ভাবে সহজ করার জন্য ওয়েব অ্যাপ তৈরি হবে।

সিস্টেমটি করবে:

* প্রতিদিনের মিল ইনপুট
* বাজার এন্ট্রি (market entry)
* মাসিক বিল এন্ট্রি (gas, current, wifi)
* প্রতি সদস্যের মিল কাউন্ট
* মিল রেট হিসাব
* প্রত্যেকের টোটাল বিল হিসাব
* রিপোর্ট জেনারেশন

---

# ✅ 2. User Roles

### **1. Admin / Manager**

* সদস্য যোগ/বাদ
* বাজার এন্ট্রি
* মাসিক বিল এন্ট্রি
* মিল রেট জেনারেশন
* রিপোর্ট জেনারেশন

### **2. Member**

* নিজের মিল দেখতে পারবে
* নিজের বিল ও ডিউ দেখতে পারবে
* রিপোর্ট দেখতে পারবে

---

# ✅ 3. Database Schema (MongoDB Version)

MongoDB ব্যবহারের জন্য এখানে Prisma (MongoDB provider) ভিত্তিক স্কিমা দেওয়া হলো।

### **Members**

```
model Member {
  id           String    @id @default(auto()) @map("_id") @db.ObjectId
  name         String
  phone        String?
  active       Boolean   @default(true)
  khalakha_fee Int       @default(700)
  createdAt    DateTime  @default(now())

  meals        Meal[]
  payments     Payment[]
  bazarsPaid   Bazar[]
}
```

### **Meals**

```
model Meal {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  memberId   String   @db.ObjectId
  date       DateTime
  breakfast  Boolean  @default(false)
  dinner     Boolean  @default(false)

  member     Member   @relation(fields: [memberId], references: [id])
}
```

### **Bazar (Market Purchases)**

```
model Bazar {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  amount      Float
  description String?
  paidById    String?  @db.ObjectId
  createdAt   DateTime @default(now())

  paidBy      Member?  @relation(fields: [paidById], references: [id])
}
```

### **Bills (Monthly Fixed Bills)**

```
model Bill {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  month     Int
  year      Int
  gas       Float   @default(0)
  current   Float   @default(0)
  wifi      Float   @default(0)
  createdAt DateTime @default(now())
}
```

### **Payments**

```
model Payment {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  memberId  String   @db.ObjectId
  amount    Float
  description String?
  createdAt DateTime @default(now())

  member    Member   @relation(fields: [memberId], references: [id])
}
```

# ✅ 4. Core Calculation Logic

## ✅ Meal Count

প্রত্যেক সদস্যের জন্য:

```
TotalMeals = sum(breakfast + dinner)
```

## ✅ Total Market Cost

```
MarketTotal = sum(all bazar entries)
```

## ✅ Meal Rate

```
MealRate = MarketTotal / TotalMeals
```

## ✅ Fixed Bill Share

```
BillSharePerMember = (gas + current + wifi) / totalMembers
```

## ✅ Monthly Calculation per Member

```
MealCost = MemberMeals × MealRate

TotalDue = MealCost + BillShare + Khalakha(700) - Payments
```

---

# ✅ 5. API Structure

```
/api/members
    GET → সকল সদস্য
    POST → নতুন সদস্য

/api/meals
    GET → মিল লিস্ট
    POST → মিল ইনপুট

/api/bazar
    GET → বাজার লিস্ট
    POST → নতুন বাজার

/api/bills
    GET → বর্তমান মাসের বিল
    POST → বিল সেট

/api/payments
    POST → সদস্য পেমেন্ট

/api/report
    GET → পুরো মাসের রিপোর্ট
```

---

# ✅ 6. Frontend Architecture (Redux + Next.js)

## ✅ Redux State Slices

1. **memberSlice** → সদস্য ডাটা
2. **mealSlice** → প্রতিদিনের মিল
3. **bazarSlice** → বাজার ডাটা
4. **billSlice** → স্থায়ী বিল
5. **paymentSlice** → পেমেন্ট ডাটা
6. **reportSlice** → মাসিক রিপোর্ট

---

# ✅ 7. UI Pages

### ✅ 1. Dashboard Page

* Total bazar
* Total meals
* Meal rate
* Summary cards

### ✅ 2. Member Page

* Member List
* Add Member Modal

### ✅ 3. Meal Entry Page

* Day-wise meal table
* Quick entry buttons

### ✅ 4. Bazar Entry Page

* Add purchase
* List of bazar

### ✅ 5. Bills Page

* gas/current/wifi input

### ✅ 6. Payments Page

* Add payment
* Payment table

### ✅ 7. Monthly Report Page

* Full member-wise breakdown
* Export option (PDF/Excel)

---

# ✅ 8. Folder Structure (Next.js + Redux)

```
src/
 ├─ app/
 │   ├─ dashboard/
 │   ├─ members/
 │   ├─ meals/
 │   ├─ bazar/
 │   ├─ bills/
 │   ├─ payments/
 │   └─ report/
 │
 ├─ components/
 ├─ redux/
 │   ├─ store.ts
 │   ├─ slices/
 │   │   ├─ memberSlice.ts
 │   │   ├─ mealSlice.ts
 │   │   ├─ bazarSlice.ts
 │   │   ├─ billSlice.ts
 │   │   ├─ paymentSlice.ts
 │   │   └─ reportSlice.ts
 │
 ├─ lib/
 │   └─ api.ts (fetch helpers)
 │
 └─ prisma/
     └─ schema.prisma
```

---

# ✅ 9. Future Upgrades

* Mobile App (React Native)
* Push Notification
* Auto PDF Export
* Multi-Month History

---


