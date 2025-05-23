

admin = {"username": "admin", "password": "vollgeheim"}
wrong_user = {"username": "admin", "password": "falsch"}
user = {"username": "test", "password": "user1234"}
ENDPOINT = "http://127.0.0.1:8000/"
dummy_data = {
    "devices": [
        {
            "device_id": "a188957e-0184-4653-b950-7b98b86f8471",
            "title": "Muster M123 Computer",
            "device_type": "computer",
            "description": "Der Muster M123 Computer ist ein fortschrittliches Gerät, das für seine hohe Zuverlässigkeit und Geschwindigkeit bekannt ist. Es verfügt über eine intuitive Bedienoberfläche und ist leicht zu installieren und zu verwenden. Mit einer Reihe nützlicher Funktionen wie einer drahtloser Konnektivität ist der Muster M123 Computer der ideale Computer für Büro- und Heimanwender.",
            "accessories": "Muster Maus, Netzteil",
            "rz_username_buyer": "user",
            "serial_number": "336AG-39HS",
            "image_url": "https://pro.mi.ur.de/ase22-devices/computer.jpg"
        },
        {
            "device_id": "a188957e-0184-4653-b950-7b98b86f8472",
            "title": "Muster D123 Laptop",
            "device_type": "laptop",
            "rz_username_buyer": "admin",
            "serial_number": "83udujh39dh",
            "image_url": "https://pro.mi.ur.de/ase22-devices/laptop.jpg"
        }
    ],
    "owner_transactions": [
        {
            "owner_transaction_id": "a188957e-0184-4653-b950-7b98b86f8473",
            "rz_username": "user",
            "timestamp_owner_since": 1674568657,
            "device_id": "a188957e-0184-4653-b950-7b98b86f8471"
        },
        {
            "owner_transaction_id": "a188957e-0184-4653-b950-7b98b86f8474",
            "rz_username": "admin",
            "timestamp_owner_since": 16747414571,
            "device_id": "a188957e-0184-4653-b950-7b98b86f8471"
        },
        {
            "owner_transaction_id": "a188957e-0184-4653-b950-7b98b86f8435",
            "rz_username": "admin",
            "timestamp_owner_since": 1664568657,
            "device_id": "a188957e-0184-4653-b950-7b98b86f8472"
        }
    ],
    "location_transactions": [
        {
            "location_transaction_id": "a188957e-0184-4653-b950-7b98b86f8476",
            "room_code": "CIP-Pool BIB1",
            "timestamp_located_since": 1674827857,
            "device_id": "a188957e-0184-4653-b950-7b98b86f8471"
        },
        {
            "location_transaction_id": "a188957e-0184-4653-b950-7b98b86f8477",
            "room_code": "CIP-Pool BIB2",
            "timestamp_located_since": 1674914257,
            "device_id": "a188957e-0184-4653-b950-7b98b86f8471"
        },
        {
            "location_transaction_id": "a188957e-0184-4653-b950-7b98b86f8478",
            "room_code": "CIP-Pool BIB3",
            "timestamp_located_since": 1664568657,
            "device_id": "a188957e-0184-4653-b950-7b98b86f8472"
        }
    ],
    "purchasing_information": [
        {
            "purchasing_information_id": "a188957e-0184-4653-b950-7b98b86f8479",
            "price": "383,99 €",
            "timestamp_warranty_end": 1694924257,
            "timestamp_purchase": 1674568657,
            "cost_centre": 12345678,
            "seller": "Mustermann Electronics",
            "device_id": "a188957e-0184-4653-b950-7b98b86f8471"
        },
        {
            "purchasing_information_id": "a188957e-0184-4653-b950-7b98b86f8480",
            "price": "1437,99 €",
            "timestamp_warranty_end": 1724924257,
            "timestamp_purchase": 1664568657,
            "cost_centre": 98765432,
            "seller": "Musterfrau Electronics",
            "device_id": "a188957e-0184-4653-b950-7b98b86f8472"
        }
    ]
}
