#!/bin/bash

# Script để test tạo order

echo "Creating test order..."

curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-001",
    "totalAmount": 299.99,
    "items": [
      {
        "sku": "ITEM-001",
        "name": "Product A",
        "quantity": 2,
        "price": 99.99
      },
      {
        "sku": "ITEM-002",
        "name": "Product B",
        "quantity": 1,
        "price": 100.01
      }
    ]
  }'

echo -e "\n\nOrder created! Check the logs of all services to see the saga flow."
