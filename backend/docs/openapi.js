const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "FSA Assignment API",
      version: "1.0.0",
      description: "API documentation for admin, user, products, stores, and orders endpoints.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        AuthRegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            useraddress: { type: "string" },
            addressData: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
        AuthLoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        AuthLoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            token: { type: "string" },
            userType: { type: "number" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            userType: { type: "number" },
            address: { type: "string" },
            addressData: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
            date: { type: "string", format: "date-time" },
          },
        },
        Admin: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            userType: { type: "number" },
            date: { type: "string", format: "date-time" },
          },
        },
        Store: {
          type: "object",
          properties: {
            _id: { type: "string" },
            storeName: { type: "string" },
            address: { type: "string" },
            category: { type: "string" },
            city: { type: "string" },
            cityData: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
            addressData: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
            adminId: { type: "string" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            productName: { type: "string" },
            quantity: { type: "number" },
            category: { type: "string" },
            price: { type: "number" },
            adminId: { type: "string" },
            storeId: { type: "string" },
          },
        },
        OrderItem: {
          type: "object",
          required: ["productId", "productName", "quantity", "price"],
          properties: {
            productId: { type: "string" },
            productName: { type: "string" },
            quantity: { type: "number", minimum: 1 },
            price: { type: "number", minimum: 0 },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            userName: { type: "string" },
            address: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "shipped", "delivered", "cancelled"],
            },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            total: { type: "number", minimum: 0 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AddStoreRequest: {
          type: "object",
          required: ["shopName", "shopAddress", "shopCategory", "shopCity", "cityData", "addressData"],
          properties: {
            shopName: { type: "string" },
            shopAddress: { type: "string" },
            shopCategory: { type: "string" },
            shopCity: { type: "string" },
            cityData: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
            addressData: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
        AddProductRequest: {
          type: "object",
          required: ["productName", "productQuantity", "productCategory", "productPrice", "storeId"],
          properties: {
            productName: { type: "string" },
            productQuantity: { type: "number" },
            productCategory: { type: "string" },
            productPrice: { type: "number" },
            storeId: { type: "string" },
          },
        },
        PlaceOrderRequest: {
          type: "object",
          required: ["userId", "userName", "items"],
          properties: {
            userId: { type: "string" },
            userName: { type: "string" },
            address: { type: "string" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
          },
        },
      },
    },
    paths: {
      "/api/users/register": {
        post: {
          tags: ["Users"],
          summary: "Register a user",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthRegisterRequest" } } },
          },
          responses: {
            200: { description: "Registered user", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
            400: { description: "Validation or duplicate email error" },
          },
        },
      },
      "/api/users/login": {
        post: {
          tags: ["Users"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthLoginRequest" } } },
          },
          responses: {
            200: { description: "JWT response", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthLoginResponse" } } } },
            400: { description: "Invalid credentials" },
          },
        },
      },
      "/api/admin/register": {
        post: {
          tags: ["Admin"],
          summary: "Register an admin",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthRegisterRequest" } } },
          },
          responses: {
            200: { description: "Registered admin", content: { "application/json": { schema: { $ref: "#/components/schemas/Admin" } } } },
            400: { description: "Validation or duplicate email error" },
          },
        },
      },
      "/api/admin/login": {
        post: {
          tags: ["Admin"],
          summary: "Login admin",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthLoginRequest" } } },
          },
          responses: {
            200: { description: "JWT response", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthLoginResponse" } } } },
            400: { description: "Invalid credentials" },
          },
        },
      },
      "/api/stores/getStores": {
        get: {
          tags: ["Stores"],
          summary: "Get all stores",
          responses: {
            200: {
              description: "Store list",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Store" } },
                },
              },
            },
          },
        },
      },
      "/api/stores/getStores/{adminId}": {
        get: {
          tags: ["Stores"],
          summary: "Get stores by admin",
          parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Store list",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Store" } },
                },
              },
            },
          },
        },
      },
      "/api/stores/addStore/{adminId}": {
        post: {
          tags: ["Stores"],
          summary: "Create a store",
          parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AddStoreRequest" } } },
          },
          responses: {
            201: { description: "Created store", content: { "application/json": { schema: { $ref: "#/components/schemas/Store" } } } },
            400: { description: "Bad request" },
          },
        },
      },
      "/api/stores/updateStore/{storeId}": {
        patch: {
          tags: ["Stores"],
          summary: "Update a store",
          parameters: [{ name: "storeId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AddStoreRequest" } } },
          },
          responses: {
            200: { description: "Updated store", content: { "application/json": { schema: { $ref: "#/components/schemas/Store" } } } },
            400: { description: "Invalid request" },
            404: { description: "Store not found" },
          },
        },
      },
      "/api/stores/deleteStore/{storeId}": {
        delete: {
          tags: ["Stores"],
          summary: "Delete a store",
          parameters: [{ name: "storeId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Delete result" },
            400: { description: "Invalid id" },
            404: { description: "Store not found" },
          },
        },
      },
      "/api/products/getItems": {
        get: {
          tags: ["Products"],
          summary: "Get all products",
          responses: {
            200: {
              description: "Product list",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                },
              },
            },
          },
        },
      },
      "/api/products/addItems/{adminId}": {
        post: {
          tags: ["Products"],
          summary: "Create a product",
          parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AddProductRequest" } } },
          },
          responses: {
            201: { description: "Created product", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
            400: { description: "Bad request" },
          },
        },
      },
      "/api/products/getStoreItem/{adminId}": {
        get: {
          tags: ["Products"],
          summary: "Get products for an admin, optionally filtered by storeId query",
          parameters: [
            { name: "adminId", in: "path", required: true, schema: { type: "string" } },
            { name: "storeId", in: "query", required: false, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Product list",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                },
              },
            },
          },
        },
      },
      "/api/products/getProductsByStore/{storeId}": {
        get: {
          tags: ["Products"],
          summary: "Get products by store",
          parameters: [{ name: "storeId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Product list",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                },
              },
            },
          },
        },
      },
      "/api/products/deleteItem/{productId}": {
        delete: {
          tags: ["Products"],
          summary: "Delete a product",
          parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Deleted" },
            404: { description: "Product not found" },
          },
        },
      },
      "/api/products/updateItem/{productId}": {
        patch: {
          tags: ["Products"],
          summary: "Update product quantity/category/price",
          parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    productQuantity: { type: "number" },
                    productCategory: { type: "string" },
                    productPrice: { type: "number" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Updated" },
          },
        },
      },
      "/api/orders/place": {
        post: {
          tags: ["Orders"],
          summary: "Place an order",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/PlaceOrderRequest" } } },
          },
          responses: {
            201: { description: "Created order", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } },
            400: { description: "Validation/stock error" },
            500: { description: "Server error" },
          },
        },
      },
      "/api/orders/all": {
        get: {
          tags: ["Orders"],
          summary: "Get all orders",
          responses: {
            200: {
              description: "Order list",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Order" } },
                },
              },
            },
          },
        },
      },
      "/api/orders/user/{userId}": {
        get: {
          tags: ["Orders"],
          summary: "Get orders for a user",
          parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Order list",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Order" } },
                },
              },
            },
            400: { description: "Invalid user id" },
          },
        },
      },
      "/api/orders/{orderId}/status": {
        patch: {
          tags: ["Orders"],
          summary: "Update order status",
          parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pending", "shipped", "delivered", "cancelled"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Updated order", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } },
            400: { description: "Invalid request" },
            404: { description: "Order not found" },
          },
        },
      },
      "/api/orders/{orderId}": {
        delete: {
          tags: ["Orders"],
          summary: "Delete order",
          parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Deleted" },
            400: { description: "Invalid id" },
            404: { description: "Order not found" },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJSDoc(options);
