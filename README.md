# Zarpa

Marketplace de reservas de naturaleza para Tingo María, hecho con Next.js 14 y Supabase.

## 1. Crear y configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard) y copia el **Project URL**, `anon key` y `service_role key`.
2. En **SQL Editor**, ejecuta primero `supabase/migrations/202608100001_initial_schema.sql` y después `supabase/seed.sql`.
3. En **Authentication > Providers**, habilita Email. Crea los usuarios de operadores desde **Authentication > Users**.
4. Vincula cada usuario creando una fila en `operators` con su UUID de Auth, tipo y el `linked_hotel_id` o `linked_experience_id` correspondiente. La restricción SQL impide enlaces ambiguos.
5. El bucket privado `payment-proofs` se crea en la migración. Los comprobantes se sirven con URL firmada únicamente dentro del panel autorizado.
6. Ejecuta también `supabase/migrations/202608100005_catalog_storage.sql` y `202608100007_admin_dashboard.sql` para fotos del catálogo y panel admin.

### Panel admin (catálogo)

1. Crea un usuario en **Authentication > Users** (correo + contraseña).
2. En **SQL Editor**, vincúlalo como admin (reemplaza el UUID):

```sql
insert into public.admins (auth_user_id, email)
values ('UUID-DEL-USUARIO-AUTH', 'tu@correo.com');
```

3. Entra en `/admin/login` → gestiona hoteles, experiencias y sube fotos al bucket `catalog`.
4. Usa estado **Activo** para publicar en la web; **Borrador** mantiene oculto el producto.

## 2. Ejecutar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Completa en `.env.local` las tres claves de Supabase. Nunca publiques `SUPABASE_SERVICE_ROLE_KEY`: solo la consume el Route Handler del servidor. Opcionalmente define los números de Yape y Plin para el checkout.

## 3. Desplegar en Vercel

1. Sube este repositorio a GitHub y en Vercel selecciona **New Project > Import**.
2. Añade las mismas variables de `.env.local` en **Settings > Environment Variables** (incluida la service role como secreto).
3. Despliega. En Supabase, añade el dominio de Vercel a **Authentication > URL Configuration** como Site URL y Redirect URL.

Para producción se recomienda sustituir los arreglos `photos` de cada fila por rutas reales de un bucket de imágenes de Supabase, manteniendo los datos de catálogo siempre en Postgres.

## Métricas de conversión

Después de ejecutar `supabase/migrations/202608100003_product_analytics.sql`, Zarpa registra eventos anónimos de navegación, selección, checkout y reserva. En SQL Editor consulta el embudo diario con:

```sql
select * from public.analytics_funnel_daily;
```

No se guardan nombre, teléfono ni correo en los eventos analíticos.
