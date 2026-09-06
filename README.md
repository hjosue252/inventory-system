# Inventory System

Sistema web de gestión de inventario desarrollado como prueba técnica
para Desarrollador .NET.

## Descripción

La aplicación permite administrar productos, proveedores y clientes,
registrar compras y ventas, actualizar automáticamente el stock y
consultar reportes de ventas.

La solución está dividida en:

-   **Backend:** ASP.NET Core 10 Web API.
-   **Frontend:** React con Next.js.
-   **Base de datos:** SQL Server.
-   **Autenticación:** ASP.NET Core Identity + JWT.
-   **Arquitectura:** Repository Pattern + Service Layer.
-   **Control de acceso:** roles `Admin` y `Vendedor`.

## Funcionalidades

### Autenticación y autorización

-   Registro de usuarios.
-   Inicio de sesión.
-   Cierre de sesión.
-   Autenticación mediante Bearer JWT.
-   Roles:
    -   `Admin`
    -   `Vendedor`
-   Operaciones administrativas protegidas mediante autorización por
    rol.
-   El frontend persiste el JWT y controla la navegación según el rol.
-   El backend mantiene la autorización como mecanismo principal de
    seguridad.

### Productos

-   Listado de productos.
-   Crear producto.
-   Consultar producto.
-   Editar producto.
-   Eliminar producto.
-   Control de nombre, descripción, precio y stock.
-   Las operaciones de modificación están restringidas al rol `Admin`.

### Proveedores

-   Listado.
-   Crear.
-   Editar.
-   Eliminar.
-   Validación de correo electrónico.
-   Operaciones protegidas para usuarios autorizados.

### Clientes

-   Listado.
-   Crear.
-   Editar.
-   Eliminar.
-   Validación de correo electrónico.
-   Operaciones protegidas para usuarios autorizados.

### Compras

-   Registro de compras con múltiples detalles.
-   Selección de proveedor.
-   Selección de productos.
-   Cantidad y precio de compra por detalle.
-   Incremento automático del stock al registrar la compra.
-   Historial de compras.

### Ventas

-   Registro de ventas con múltiples detalles.
-   Selección de cliente.
-   Selección de productos.
-   Cantidad y precio de venta por detalle.
-   Validación de stock disponible.
-   Decremento automático del stock al registrar la venta.
-   Historial de ventas.

### Reportes y dashboard

-   Reporte de ventas por rango de fechas.
-   Total vendido.
-   Cantidad de productos vendidos.
-   Resumen de ventas recientes.
-   Productos con stock bajo.
-   Dashboard con indicadores generales del inventario.

## Arquitectura

``` text
inventory-system/
│
├── BackEnd/
│   └── InventarioApi/
│       ├── InventarioApi/
│       │   ├── Controllers/
│       │   ├── Data/
│       │   ├── DTOs/
│       │   ├── Models/
│       │   ├── Repositories/
│       │   ├── Services/
│       │   ├── Properties/
│       │   ├── Program.cs
│       │   ├── appsettings.json
│       │   └── InventarioApi.csproj
│       └── InventarioApi.slnx
│
├── FrontEnd/
│   └── inventario-web/
│       ├── app/
│       ├── public/
│       ├── package.json
│       └── .env.local
│
└── .gitignore
```

### Backend

La API utiliza una separación por responsabilidades:

``` text
Controller
   ↓
Service
   ↓
Repository
   ↓
Entity Framework Core
   ↓
SQL Server
```

Los **Controllers** manejan HTTP y autorización, los **Services**
contienen la lógica de negocio y los **Repositories** encapsulan el
acceso a datos.

Los DTOs separan los contratos HTTP de las entidades de persistencia.

## Modelo de datos

Entidades principales:

-   `Producto`
-   `Proveedor`
-   `Compra`
-   `CompraDetalle`
-   `Cliente`
-   `Venta`
-   `VentaDetalle`
-   `ApplicationUser`

Las compras y ventas utilizan una relación cabecera-detalle. Se
agregaron `CompraId` y `VentaId` en las entidades de detalle para poder
persistir correctamente la relación entre cada documento y sus líneas.

Relaciones principales:

``` text
Proveedor 1 ───── N Compra
Compra    1 ───── N CompraDetalle
Producto  1 ───── N CompraDetalle

Cliente   1 ───── N Venta
Venta     1 ───── N VentaDetalle
Producto  1 ───── N VentaDetalle
```

## Tecnologías

### Backend

-   C#
-   ASP.NET Core 10 Web API
-   Entity Framework Core 10
-   SQL Server
-   ASP.NET Core Identity
-   JWT Bearer Authentication
-   DataAnnotations
-   Swagger / OpenAPI
-   Repository Pattern
-   Service Layer

### Frontend

-   React
-   Next.js 16
-   TypeScript
-   Tailwind CSS
-   Fetch API

### Control de versiones

-   Git
-   GitHub

## Paquetes NuGet principales

-   `Microsoft.EntityFrameworkCore.SqlServer`
-   `Microsoft.EntityFrameworkCore.Design`
-   `Microsoft.EntityFrameworkCore.Tools`
-   `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
-   `Microsoft.AspNetCore.Authentication.JwtBearer`
-   `System.IdentityModel.Tokens.Jwt`
-   `Swashbuckle.AspNetCore`

## Requisitos previos

Para ejecutar el proyecto localmente:

-   .NET 10 SDK
-   SQL Server o SQL Server LocalDB
-   Node.js
-   npm
-   Git

## Configuración local del backend

Las credenciales y secretos locales no se almacenan en el repositorio.

El proyecto utiliza **ASP.NET Core User Secrets** para:

-   Connection String de SQL Server.
-   Clave privada utilizada para firmar los tokens JWT.

Ejemplo de configuración local:

``` powershell
cd "BackEnd\InventarioApi"

dotnet user-secrets init --project ".\InventarioApi\InventarioApi.csproj"

dotnet user-secrets set "ConnectionStrings:DefaultConnection" "TU_CONNECTION_STRING" --project ".\InventarioApi\InventarioApi.csproj"

dotnet user-secrets set "Jwt:Key" "TU_CLAVE_JWT" --project ".\InventarioApi\InventarioApi.csproj"
```

Los valores reales deben mantenerse fuera del repositorio.

La configuración no sensible de JWT se encuentra en `appsettings.json`:

``` json
{
  "Jwt": {
    "Issuer": "InventarioApi",
    "Audience": "InventarioApiUsers",
    "ExpirationMinutes": 60
  }
}
```

## Base de datos local

La aplicación fue desarrollada y probada con SQL Server LocalDB.

Ejemplo de connection string:

``` text
Server=(localdb)\ProjectModels;Database=InventarioDb;Trusted_Connection=True;TrustServerCertificate=True;
```

Las migraciones de Entity Framework Core se encuentran en el proyecto
del backend.

Para aplicar las migraciones:

``` powershell
Update-Database
```

o mediante CLI:

``` powershell
dotnet ef database update --project ".\InventarioApi\InventarioApi.csproj"
```

## Ejecutar el backend

Desde la carpeta del backend:

``` powershell
cd "BackEnd\InventarioApi"

dotnet run --project ".\InventarioApi\InventarioApi.csproj" --launch-profile https
```

API local:

``` text
https://localhost:7166
```

Swagger:

``` text
https://localhost:7166/swagger
```

## Ejecutar el frontend

Desde la carpeta del frontend:

``` powershell
cd "FrontEnd\inventario-web"

npm install
npm run dev
```

Aplicación local:

``` text
http://localhost:3000
```

La URL de la API se configura mediante:

``` env
NEXT_PUBLIC_API_URL=https://localhost:7166
```

Este valor se encuentra en `.env.local` durante el desarrollo local y no
debe publicarse en Git cuando contenga configuración específica del
entorno.

## Usuario administrador local

El backend crea automáticamente los roles requeridos y un usuario
administrador inicial para el entorno de desarrollo.

Por seguridad, las credenciales de acceso no se documentan como secretos
en el repositorio. Para una implementación de producción, las
credenciales iniciales deben configurarse mediante variables/secretos
del entorno y rotarse después del primer acceso.

## Endpoints principales

### Auth

``` text
POST /api/Auth/register
POST /api/Auth/login
POST /api/Auth/logout
```

### Productos

``` text
GET    /api/Productos
GET    /api/Productos/{id}
POST   /api/Productos
PUT    /api/Productos/{id}
DELETE /api/Productos/{id}
```

### Proveedores

``` text
GET    /api/Proveedores
GET    /api/Proveedores/{id}
POST   /api/Proveedores
PUT    /api/Proveedores/{id}
DELETE /api/Proveedores/{id}
```

### Clientes

``` text
GET    /api/Clientes
GET    /api/Clientes/{id}
POST   /api/Clientes
PUT    /api/Clientes/{id}
DELETE /api/Clientes/{id}
```

### Compras

``` text
GET  /api/Compras
GET  /api/Compras/{id}
POST /api/Compras
```

### Ventas

``` text
GET  /api/Ventas
GET  /api/Ventas/{id}
POST /api/Ventas
```

### Reportes

``` text
GET /api/Reportes/ventas?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD
```

## Reglas de negocio

### Compra

Al registrar una compra:

``` text
Stock nuevo = Stock actual + Cantidad comprada
```

### Venta

Antes de registrar una venta se valida que exista stock suficiente:

``` text
Stock disponible >= Cantidad solicitada
```

Después:

``` text
Stock nuevo = Stock actual - Cantidad vendida
```

Las validaciones de negocio se ejecutan en el backend para no depender
exclusivamente del frontend.

## Manejo de errores

La API devuelve respuestas HTTP apropiadas para los casos principales:

-   `200 OK`
-   `201 Created`
-   `204 No Content`
-   `400 Bad Request`
-   `401 Unauthorized`
-   `403 Forbidden`
-   `404 Not Found`

El frontend interpreta estos estados y muestra mensajes amigables al
usuario.

## Seguridad

-   JWT Bearer para autenticación.
-   ASP.NET Core Identity para usuarios y roles.
-   Autorización basada en roles.
-   Secretos locales mediante User Secrets.
-   `.env.local` excluido de Git.
-   Connection strings fuera de `appsettings.json`.
-   Validación de datos mediante DataAnnotations.
-   El backend valida stock, existencia de productos y clientes y
    permisos.

## Nota sobre despliegue

El proyecto fue preparado y probado completamente en entorno local. Se evaluó realizar el despliegue en Azure, pero durante el acceso al portal se presentó un problema de autenticación relacionado con el tenant de la cuenta personal de Microsoft/Azure (`AADSTS16000`). La cuenta podía acceder al portal, pero no podía obtener los tokens necesarios para acceder a la aplicación de Azure dentro del tenant `Microsoft Services`, por lo que el despliegue en la nube no se completó.

Este inconveniente no afecta la ejecución local del proyecto ni su funcionamiento con SQL Server LocalDB.

## Consideraciones técnicas

1.  Se utilizaron relaciones explícitas `CompraId` y `VentaId` en los
    detalles para representar correctamente las relaciones
    cabecera-detalle.
2.  La actualización de stock se realiza en la capa de servicios.
3.  EF Core persiste los cambios de stock y del documento dentro de la
    operación de guardado.
4.  El frontend controla la experiencia de usuario y las restricciones
    de navegación, pero la autorización real se ejecuta en el backend.
5.  El endpoint de logout es stateless: el frontend elimina el JWT
    almacenado. La expiración del token limita su vigencia.
6.  Los precios se almacenan como `decimal(18,2)`.
7.  Los secretos específicos del entorno no se almacenan en Git.

## Pruebas realizadas

Se verificaron localmente:

-   Login con usuario administrador.
-   CRUD de productos.
-   CRUD de proveedores.
-   CRUD de clientes.
-   Registro de compras.
-   Incremento de stock después de una compra.
-   Registro de ventas.
-   Validación de stock insuficiente.
-   Decremento de stock después de una venta.
-   Reporte de ventas por rango de fechas.
-   Navegación protegida mediante JWT.
-   Restricciones de interfaz según rol.
-   Build de producción del frontend mediante `npm run build`.

## Repositorio

GitHub:

https://github.com/hjosue252/inventory-system

## Estado del proyecto

La solución se encuentra funcional en entorno local.

Pendiente de completar:

-   Despliegue del backend en Azure App Service.
-   Despliegue de Azure SQL Database.
-   Despliegue del frontend.
-   Actualización de URLs de producción.
-   Actualización de CORS para producción.
-   Agregar enlaces definitivos de despliegue a este README.
