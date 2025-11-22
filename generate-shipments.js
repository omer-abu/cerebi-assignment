/*
this code generates COUNT amount of shipments with the below data structure.
note that riskScore is missing from here on purpose despite being in the dashboard,
this is because that metric gets calculated later on based on the parameters of a shipment data.
*/

import { writeFileSync } from 'fs'

function generateShipments(count) {
    const places = [
        'Tel-Aviv',
        'New York',
        'London',
        'Paris',
        'Tokyo',
        'Sydney',
        'Berlin',
        'Toronto',
        'Singapore',
        'Los Angeles'
    ]

    const statuses = [
        'pending-pickup',
        'picked-up',
        'in-transit',
        'arrived-at-hub',
        'out-for-delivery',
        'delivered'
    ]

    const shipments = []

    for (let i = 1; i <= count; i++) {
        const origin = places[Math.floor(Math.random() * places.length)]
        let destination = places[Math.floor(Math.random() * places.length)]

        // prevent origin == destination
        while (destination === origin) {
            destination = places[Math.floor(Math.random() * places.length)]
        }
        
        const holidayPurchase = Math.random() < 0.1

        const shipment = {
            id: String(100 + i),
            route: {
                origin,
                destination
            },
            purchasedAtHoliday: holidayPurchase,
            expectedDeliveryDate: Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7 * 4), //within a month from now, ms
            currentStatus: statuses[Math.floor(Math.random() * statuses.length)],
            timeAtCurrentStatus: Math.floor(Math.random() * 730), // in hours, up to a month
        }

        shipments.push(shipment)
    }

    return shipments
}

const COUNT = 15
const data = generateShipments(COUNT)

writeFileSync('sample-shipments.json', JSON.stringify(data, null, 2))
