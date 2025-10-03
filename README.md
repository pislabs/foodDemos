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

# 参考

- 源码：https://github.com/notJust-dev/FoodOrdering
