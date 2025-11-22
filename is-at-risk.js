/*
this script checks all the shipment data objects in sample-shipments.json
for risk of being delayed
*/

import { readFileSync } from 'fs'

/* reference shipmentData
    "id": "101",
    "route": {
      "origin": "Toronto",
      "destination": "Berlin"
    },
    "purchasedAtHoliday": true,
    "expectedDeliveryDate": 1765062917660,
    "currentStatus": "picked-up",
    "timeAtCurrentStatus": 625
*/

const contents = JSON.parse(readFileSync("./sample-shipments.json"))

contents.forEach(shipmentData => {
    const atRisk = isShipmentAtRisk(shipmentData)
    console.log(`Shipment ${shipmentData.id} at risk status: ${atRisk}\n`)
});


/*
instead of simple true or false for each rule
we could give each a weight and at the end check if the weight passes a threshold
this would result in better predictions if weights are given reasonably
*/
function isShipmentAtRisk(shipmentData) {
    const shipmentId = shipmentData.id
    // cant be at risk of delay if shipment is already marked as delivered
    if (shipmentData.currentStatus === "delivered") {
        console.log(`shipment ${shipmentId} already delivered`)
        return false
    }

    //if the expected delivery date is within 48 hours and shipment is not out for delivery
    const timeToDelivery = shipmentData.expectedDeliveryDate - Date.now()
    if (timeToDelivery <= 3600000 * 48 && shipmentData.currentStatus != "out-for-delivery") {
        console.log(`shipment ${shipmentId} expected to be delivered within 24 hours but not out for delivery`)
        return true
    }

    if (shipmentData.purchasedAtHoliday) {
        console.log(`shipment ${shipmentId} bought at holiday`)
        return true
    }

    //over a 2 weeks at current status`
    if (shipmentData.timeAtCurrentStatus > 336) {
        console.log(`shipment ${shipmentId} at current status for over 2 weeks`)
        return true
    }

    console.log(`none of the rules applied to shipment ${shipmentId}`)
    return false
}