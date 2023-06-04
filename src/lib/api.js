/*
A throttled superagent version of: SpaceTraders API 2.0.0

SpaceTraders is an open-universe game and learning platform that offers a set of HTTP endpoints to control a fleet of ships and explore a multiplayer universe.

The API is documented using [OpenAPI](https://github.com/SpaceTradersAPI/api-docs). You can send your first request right here in your browser to check the status of the game server.

```json http
{
  "method": "GET",
  "url": "https://api.spacetraders.io/v2",
}
```

Unlike a traditional game, SpaceTraders does not have a first-party client or app to play the game. Instead, you can use the API to build your own client, write a script to automate your ships, or try an app built by the community.

We have a [Discord channel](https://discord.com/invite/jh6zurdWk5) where you can share your projects, ask questions, and get help from other players.


*/

import superagent from "superagent";
import Throttle from "superagent-throttle";
import { Supplant } from './supplant';

const Root = "https://api.spacetraders.io/v2".replace(/\/+$/, "");

const throttle = new Throttle({
	active: true,	// set false to pause queue
	rate: 1,			// how many requests can be sent every `ratePer`
	ratePer: 501,	// number of ms in which `rate` requests may be sent
	concurrent: 2	// how many requests can be sent concurrently
});

/**
 * Get Status
 * Return the status of the game server.
 * @returns {Promise<{body:{ status:string, version:string, resetDate:string, description:string, stats:{ agents:number, ships:number, systems:number, waypoints:number }, leaderboards:{ mostCredits:object[], mostSubmittedCharts:object[] }, serverResets:{ next:string, frequency:string }, announcements:object[], links:object[] }}>}
*/
export const getStatus = () => superagent
	.get(`${Root}/`)
	.use(throttle.plugin(undefined))
	.accept("json");

/**
 * List Factions
 * List all discovered factions in the game.
 * @param {{ page?:number, limit?:number }} data
 * @returns {Promise<{body:{ data:Faction[], meta:Meta }}>}
*/
export const listFactions = ({ page, limit }) => superagent
	.get(`${Root}/factions`)
	.use(throttle.plugin(undefined))
	.query({ page, limit })
	.accept("json");

/**
 * Get Faction
 * View the details of a faction.
 * @param {{ factionSymbol:string }} data
 * @returns {Promise<{body:{ data:Faction }}>}
*/
export const getFaction = ({ factionSymbol }) => superagent
	.get(`${Root}/factions/${factionSymbol}`)
	.use(throttle.plugin(undefined))
	.accept("json");

/**
 * My Agent Details
 * Fetch your agent's details.
 * @param {{ token:string }} data
 * @returns {Promise<{body:{ data:Agent }}>}
*/
export const myAgentDetails = ({ token }) => superagent
	.get(`${Root}/my/agent`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * List Contracts
 * List all of your contracts.
 * @param {{ token:string, page?:number, limit?:number }} data
 * @returns {Promise<{body:{ data:Contract[], meta:Meta }}>}
*/
export const listContracts = ({ token, page, limit }) => superagent
	.get(`${Root}/my/contracts`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.query({ page, limit })
	.accept("json");

/**
 * Get Contract
 * Get the details of a contract by ID.
 * @param {{ contractId:string, token:string }} data
 * @returns {Promise<{body:{ data:Contract }}>}
*/
export const getContract = ({ contractId, token }) => superagent
	.get(`${Root}/my/contracts/${contractId}`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Accept Contract
 * Accept a contract.
 * @param {{ contractId:string, token:string }} data
 * @returns {Promise<{body:{ data:{ agent:Agent, contract:Contract } }}>}
*/
export const acceptContract = ({ contractId, token }) => superagent
	.post(`${Root}/my/contracts/${contractId}/accept`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Deliver Contract
 * Deliver cargo on a given contract.
 * @param {{ contractId:string, shipSymbol:string, tradeSymbol:string, units:number, token:string }} data
 * @returns {Promise<{body:{ data:{ contract:Contract, cargo:ShipCargo } }}>}
*/
export const deliverContract = ({ contractId, shipSymbol, tradeSymbol, units, token }) => superagent
	.post(`${Root}/my/contracts/${contractId}/deliver`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ shipSymbol, tradeSymbol, units })
	.accept("json");

/**
 * Fulfill Contract
 * Fulfill a contract
 * @param {{ contractId:string, token:string }} data
 * @returns {Promise<{body:{ data:{ agent:Agent, contract:Contract } }}>}
*/
export const fulfillContract = ({ contractId, token }) => superagent
	.post(`${Root}/my/contracts/${contractId}/fulfill`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * List Ships
 * Retrieve all of your ships.
 * @param {{ token:string, page?:number, limit?:number }} data
 * @returns {Promise<{body:{ data:Ship[], meta:Meta }}>}
*/
export const listShips = ({ token, page, limit }) => superagent
	.get(`${Root}/my/ships`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.query({ page, limit })
	.accept("json");

/**
 * Purchase Ship
 * Purchase a ship
 * @param {{ shipType:string, waypointSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ agent:Agent, ship:Ship, transaction:ShipyardTransaction } }}>}
*/
export const purchaseShip = ({ shipType, waypointSymbol, token }) => superagent
	.post(`${Root}/my/ships`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ shipType, waypointSymbol })
	.accept("json");

/**
 * Get Ship
 * Retrieve the details of your ship.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:Ship }}>}
*/
export const getShip = ({ shipSymbol, token }) => superagent
	.get(`${Root}/my/ships/${shipSymbol}`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Get Ship Cargo
 * Retrieve the cargo of your ship.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:ShipCargo }}>}
*/
export const getShipCargo = ({ shipSymbol, token }) => superagent
	.get(`${Root}/my/ships/${shipSymbol}/cargo`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Create Chart
 * Command a ship to chart the current waypoint. Waypoints in the universe are uncharted by default. These locations will not show up in the API until they have been charted by a ship. Charting a location will record your agent as the one who created the chart.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ chart:Chart, waypoint:Waypoint } }}>}
*/
export const createChart = ({ shipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/chart`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Get Ship Cooldown
 * Retrieve the details of your ship's reactor cooldown. Some actions such as activating your jump drive, scanning, or extracting resources taxes your reactor and results in a cooldown. Your ship cannot perform additional actions until your cooldown has expired. The duration of your cooldown is relative to the power consumption of the related modules or mounts for the action taken. Response returns a 204 status code (no-content) when the ship has no cooldown.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:Cooldown }}>}
*/
export const getShipCooldown = ({ shipSymbol, token }) => superagent
	.get(`${Root}/my/ships/${shipSymbol}/cooldown`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Dock Ship
 * Attempt to dock your ship at it's current location. Docking will only succeed if the waypoint is a dockable location, and your ship is capable of docking at the time of the request. The endpoint is idempotent - successive calls will succeed even if the ship is already docked.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ nav:ShipNav } }}>}
*/
export const dockShip = ({ shipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/dock`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Extract Resources
 * Extract resources from the waypoint into your ship. Send an optional survey as the payload to target specific yields.
 * @param {{ shipSymbol:string, survey?:object, token:string }} data
 * @returns {Promise<{body:{ data:{ cooldown:Cooldown, extraction:Extraction, cargo:ShipCargo } }}>}
*/
export const extractResources = ({ shipSymbol, survey, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/extract`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ survey })
	.accept("json");

/**
 * Jettison Cargo
 * Jettison cargo from your ship's cargo hold.
 * @param {{ shipSymbol:string, symbol:string, units:number, token:string }} data
 * @returns {Promise<{body:{ data:{ cargo:ShipCargo } }}>}
*/
export const jettisonCargo = ({ shipSymbol, symbol, units, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/jettison`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ symbol, units })
	.accept("json");

/**
 * Jump Ship
 * Jump your ship instantly to a target system. When used while in orbit or docked to a jump gate waypoint, any ship can use this command. When used elsewhere, jumping requires a jump drive unit and consumes a unit of antimatter (which needs to be in your cargo).
 * @param {{ shipSymbol:string, systemSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ cooldown:Cooldown, nav?:ShipNav } }}>}
*/
export const jumpShip = ({ shipSymbol, systemSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/jump`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ systemSymbol })
	.accept("json");

/**
 * Get Mounts
 * Get the mounts on a ship.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:ShipMount[] }}>}
*/
export const getMounts = ({ shipSymbol, token }) => superagent
	.get(`${Root}/my/ships/${shipSymbol}/mounts`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Install Mount
 * Install a mount on a ship.
 * @param {{ shipSymbol:string, symbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ agent:Agent, mounts:ShipMount[], cargo:ShipCargo } }}>}
*/
export const installMount = ({ shipSymbol, symbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/mounts/install`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ symbol })
	.accept("json");

/**
 * Remove Mount
 * Remove a mount from a ship.
 * @param {{ shipSymbol:string, symbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ agent:Agent, mounts:ShipMount[], cargo:ShipCargo } }}>}
*/
export const removeMount = ({ shipSymbol, symbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/mounts/remove`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ symbol })
	.accept("json");

/**
 * Get Ship Nav
 * Get the current nav status of a ship.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:ShipNav }}>}
*/
export const getShipNav = ({ shipSymbol, token }) => superagent
	.get(`${Root}/my/ships/${shipSymbol}/nav`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Patch Ship Nav
 * Update the nav data of a ship, such as the flight mode.
 * @param {{ shipSymbol:string, flightMode?:string, token:string }} data
 * @returns {Promise<{body:{ data:ShipNav }}>}
*/
export const patchShipNav = ({ shipSymbol, flightMode, token }) => superagent
	.patch(`${Root}/my/ships/${shipSymbol}/nav`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ flightMode })
	.accept("json");

/**
 * Navigate Ship
 * Navigate to a target destination. The destination must be located within the same system as the ship. Navigating will consume the necessary fuel and supplies from the ship's manifest, and will pay out crew wages from the agent's account. The returned response will detail the route information including the expected time of arrival. Most ship actions are unavailable until the ship has arrived at it's destination. To travel between systems, see the ship's warp or jump actions.
 * @param {{ shipSymbol:string, waypointSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ fuel:ShipFuel, nav:ShipNav } }}>}
*/
export const navigateShip = ({ shipSymbol, waypointSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/navigate`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ waypointSymbol })
	.accept("json");

/**
 * Negotiate Contract
 * 
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ contract:Contract } }}>}
*/
export const negotiateContract = ({ shipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/negotiate/contract`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Orbit Ship
 * Attempt to move your ship into orbit at it's current location. The request will only succeed if your ship is capable of moving into orbit at the time of the request. The endpoint is idempotent - successive calls will succeed even if the ship is already in orbit.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ nav:ShipNav } }}>}
*/
export const orbitShip = ({ shipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/orbit`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Purchase Cargo
 * Purchase cargo.
 * @param {{ shipSymbol:string, symbol:string, units:number, token:string }} data
 * @returns {Promise<{body:{ data:{ agent:Agent, cargo:ShipCargo, transaction:MarketTransaction } }}>}
*/
export const purchaseCargo = ({ shipSymbol, symbol, units, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/purchase`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ symbol, units })
	.accept("json");

/**
 * Ship Refine
 * Attempt to refine the raw materials on your ship. The request will only succeed if your ship is capable of refining at the time of the request.
 * @param {{ shipSymbol:string, produce:string, token:string }} data
 * @returns {Promise<{body:{ data:{ cargo:ShipCargo, cooldown:Cooldown, produced:object[], consumed:object[] } }}>}
*/
export const shipRefine = ({ shipSymbol, produce, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/refine`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ produce })
	.accept("json");

/**
 * Refuel Ship
 * Refuel your ship from the local market.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ agent:Agent, fuel:ShipFuel, transaction:MarketTransaction } }}>}
*/
export const refuelShip = ({ shipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/refuel`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Scan Ships
 * Activate your ship's sensor arrays to scan for ship information.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ cooldown:Cooldown, ships:ScannedShip[] } }}>}
*/
export const scanShips = ({ shipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/scan/ships`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Scan Systems
 * Activate your ship's sensor arrays to scan for system information.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ cooldown:Cooldown, systems:ScannedSystem[] } }}>}
*/
export const scanSystems = ({ shipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/scan/systems`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Scan Waypoints
 * Activate your ship's sensor arrays to scan for waypoint information.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ cooldown:Cooldown, waypoints:ScannedWaypoint[] } }}>}
*/
export const scanWaypoints = ({ shipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/scan/waypoints`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Sell Cargo
 * Sell cargo.
 * @param {{ shipSymbol:string, symbol:string, units:number, token:string }} data
 * @returns {Promise<{body:{ data:{ agent:Agent, cargo:ShipCargo, transaction:MarketTransaction } }}>}
*/
export const sellCargo = ({ shipSymbol, symbol, units, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/sell`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ symbol, units })
	.accept("json");

/**
 * Create Survey
 * If you want to target specific yields for an extraction, you can survey a waypoint, such as an asteroid field, and send the survey in the body of the extract request. Each survey may have multiple deposits, and if a symbol shows up more than once, that indicates a higher chance of extracting that resource. Your ship will enter a cooldown between consecutive survey requests. Surveys will eventually expire after a period of time. Multiple ships can use the same survey for extraction.
 * @param {{ shipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ cooldown:Cooldown, surveys:Survey[] } }}>}
*/
export const createSurvey = ({ shipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/survey`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Transfer Cargo
 * Transfer cargo between ships.
 * @param {{ shipSymbol:string, tradeSymbol:string, units:number, destShipSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ cargo:ShipCargo } }}>}
*/
export const transferCargo = ({ shipSymbol, tradeSymbol, units, destShipSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/transfer`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ tradeSymbol, units, shipSymbol:destShipSymbol })
	.accept("json");

/**
 * Warp Ship
 * Warp your ship to a target destination in another system. Warping will consume the necessary fuel and supplies from the ship's manifest, and will pay out crew wages from the agent's account. The returned response will detail the route information including the expected time of arrival. Most ship actions are unavailable until the ship has arrived at it's destination.
 * @param {{ shipSymbol:string, waypointSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:{ fuel:ShipFuel, nav:ShipNav } }}>}
*/
export const warpShip = ({ shipSymbol, waypointSymbol, token }) => superagent
	.post(`${Root}/my/ships/${shipSymbol}/warp`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.send({ waypointSymbol })
	.accept("json");

/**
 * Register New Agent
 * Creates a new agent and ties it to a temporary Account. The agent symbol is a 3-14 character string that will represent your agent. This symbol will prefix the symbol of every ship you own. Agent symbols will be cast to all uppercase characters. A new agent will be granted an authorization token, a contract with their starting faction, a command ship with a jump drive, and one hundred thousand credits. > #### Keep your token safe and secure > > Save your token during the alpha phase. There is no way to regenerate this token without starting a new agent. In the future you will be able to generate and manage your tokens from the SpaceTraders website. You can accept your contract using the `/my/contracts/{contractId}/accept` endpoint. You will want to navigate your command ship to a nearby asteroid field and execute the `/my/ships/{shipSymbol}/extract` endpoint to mine various types of ores and minerals. Return to the contract destination and execute the `/my/ships/{shipSymbol}/deliver` endpoint to deposit goods into the contract. When your contract is fulfilled, you can call `/my/contracts/{contractId}/fulfill` to retrieve payment.
 * @param {{ faction, symbol:string, email?:string }} data
 * @returns {Promise<{body:{ data:{ agent:Agent, contract:Contract, faction:Faction, ship:Ship, token:string } }}>}
*/
export const registerNewAgent = ({ faction, symbol, email }) => superagent
	.post(`${Root}/register`)
	.use(throttle.plugin(undefined))
	.send({ faction, symbol, email })
	.accept("json");

/**
 * List Systems
 * Return a list of all systems.
 * @param {{ page?:number, limit?:number }} data
 * @returns {Promise<{body:{ data:System[], meta:Meta }}>}
*/
export const listSystems = ({ page, limit }) => superagent
	.get(`${Root}/systems`)
	.use(throttle.plugin(undefined))
	.query({ page, limit })
	.accept("json");

/**
 * Get System
 * Get the details of a system.
 * @param {{ systemSymbol:string }} data
 * @returns {Promise<{body:{ data:System }}>}
*/
export const getSystem = ({ systemSymbol }) => superagent
	.get(`${Root}/systems/${systemSymbol}`)
	.use(throttle.plugin(undefined))
	.accept("json");

/**
 * List Waypoints
 * Fetch all of the waypoints for a given system. System must be charted or a ship must be present to return waypoint details.
 * @param {{ systemSymbol:string, token:string, page?:number, limit?:number }} data
 * @returns {Promise<{body:{ data:Waypoint[], meta:Meta }}>}
*/
export const listWaypoints = ({ systemSymbol, token, page, limit }) => superagent
	.get(`${Root}/systems/${systemSymbol}/waypoints`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.query({ page, limit })
	.accept("json");

/**
 * Get Waypoint
 * View the details of a waypoint.
 * @param {{ systemSymbol:string, waypointSymbol:string }} data
 * @returns {Promise<{body:{ data:Waypoint }}>}
*/
export const getWaypoint = ({ systemSymbol, waypointSymbol }) => superagent
	.get(`${Root}/systems/${systemSymbol}/waypoints/${waypointSymbol}`)
	.use(throttle.plugin(undefined))
	.accept("json");

/**
 * Get Jump Gate
 * Get jump gate details for a waypoint.
 * @param {{ systemSymbol:string, waypointSymbol:string }} data
 * @returns {Promise<{body:{ data:JumpGate }}>}
*/
export const getJumpGate = ({ systemSymbol, waypointSymbol }) => superagent
	.get(`${Root}/systems/${systemSymbol}/waypoints/${waypointSymbol}/jump-gate`)
	.use(throttle.plugin(undefined))
	.accept("json");

/**
 * Get Market
 * Retrieve imports, exports and exchange data from a marketplace. Imports can be sold, exports can be purchased, and exchange goods can be purchased or sold. Send a ship to the waypoint to access trade good prices and recent transactions.
 * @param {{ systemSymbol:string, waypointSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:Market }}>}
*/
export const getMarket = ({ systemSymbol, waypointSymbol, token }) => superagent
	.get(`${Root}/systems/${systemSymbol}/waypoints/${waypointSymbol}/market`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/**
 * Get Shipyard
 * Get the shipyard for a waypoint. Send a ship to the waypoint to access ships that are currently available for purchase and recent transactions.
 * @param {{ systemSymbol:string, waypointSymbol:string, token:string }} data
 * @returns {Promise<{body:{ data:Shipyard }}>}
*/
export const getShipyard = ({ systemSymbol, waypointSymbol, token }) => superagent
	.get(`${Root}/systems/${systemSymbol}/waypoints/${waypointSymbol}/shipyard`)
	.use(throttle.plugin(undefined))
	.auth(token, { type: "bearer" })
	.accept("json");

/* DIV */

/**
 * Exexcute a custom query
 * @param {{ Name:string, Method:string, Root:string, Path:string, useAuth:boolean, HasPathParams:boolean, PathParams:string, HasQueryParams:boolean, QueryParams:string, HasBody:boolean, Body:string, Answer:string, token:string }} data 
 * @returns {Promise<{ body:{ data:object, meta?:Meta } }>}
 */
export const customQuery = (data) => {
	const url = data.Root.replace(/\/+$/, "") + (data.HasPathParams ? Supplant(data.Path, JSON.parse(data.PathParams)) : data.Path);
	let agent = superagent(data.Method, url);
	if (data.useAuth)
		agent = agent.use(throttle.plugin(undefined));
	agent = agent.auth(data.token, { type: "bearer" })

	if (data.HasQueryParams)
		agent = agent.query(JSON.parse(data.QueryParams));

	if (data.HasBody)
		agent = agent.send(JSON.parse(data.Body));

	return agent.accept("json");
}
