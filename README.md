# 创建项目

```bash
# 创建项目
npx create-expo-app@latest foodDemos -t

# 将app、components、constants移入src
# 修改tsconfig.json的paths，重新启动即可

```

# Supabase

```bash
# 生成supabase typescript
npx supabase gen types typescript --project-id acnopaldoudvqyoprilr > src/database.types.ts
```

## local supabase

```bash
npx supabase login

npx supabase init

npx supabase link --project-ref acnopaldoudvqyoprilr

# start docker desktop

# 拉取supabase镜像
npx supabase db pull

# 启动supabase
npx supabase start

# 同步db
npx supabase db diff -f add_stripe_field
```

## supabase payment

```bash
npx supabase functions new payment-sheet

npx supabase functions serve --env-file .env payment-sheet

npx supabase functions deploy payment-sheet

# stripe key
# pk_test_51SEVu53Fb8ekroNeQIKBBOetAOK7MVOaa1mUTz96SIvfuSyukSESCffB6iTb5oSS9OhperCUDKv31wEeyAJImF7i00wFkK5MKo
# sk_test_51SEVu53Fb8ekroNeFTY7kfJQkP96yDDtq0CLl2FM3L4sh2BDcDAmXhaMMRGEO9AdIEr6zVgwMcdoy0Wdnc3w5gq200VEN93Y8b
```

# Notification

```bash

# 安装expo eas
npm install --global eas-cli

eas login

eas build:configure

npx expo install expo-notifications expo-device expo-constants
```

# 参考

- 源码：https://github.com/notJust-dev/FoodOrdering
