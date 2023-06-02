import superagent from 'superagent';
import Throttle from 'superagent-throttle';
import { Supplant } from './supplant';

const Root = 'https://api.spacetraders.io/v2/'.replace(/\/+$/, '');

let throttle = new Throttle({
	active: true,	// set false to pause queue
	rate: 1,			// how many requests can be sent every `ratePer`
	ratePer: 501,	// number of ms in which `rate` requests may be sent
	concurrent: 2	// how many requests can be sent concurrently
 })

const remElems = (obj, Elems) => {
	let Retour = {};
	for (const Elem of Elems) {
		Retour[Elem] = obj[Elem];
		delete obj[Elem];
	}
	return Object.keys(Retour).length === 0 ? undefined : Retour;
}
const splitObject = (body, { queryElems = [], pathElems = [] }) => ({
	token: remElems(body, ['token']).token,
	query: remElems(body, queryElems),
	path: remElems(body, pathElems),
	body,
});

/***********/
/* GENERAL */
/***********/

/**
 * Get Status
 * @returns {Promise<{body:{data:Status}}>}
 */
export const getStatus = () => superagent.get(Root + '/').use(throttle.plugin(undefined)).accept('json');

/**
 * @typedef {Object} Register
 * @property {string} tag 
 * @property {string} faction
 * @property {string} [mail]
 */

/**
 * Register a new User
 * @param {Register} data 
 * @returns {Promise<{body:{data:{agent:Agent, contract:Contract, faction:Faction, ship:Ship, token:string}}}>}
 */
export const register = (data) =>
	superagent.post(Root + '/register')
		.use(throttle.plugin(undefined))
		.send(data)
		.accept('json');

/* AGENTS */

/**
 * Get Agent details
 * @returns {Promise<{body:{data: Agent}}>}
 */
export const getAgent = () => superagent.get(Root + '/my/agent').use(throttle.plugin(undefined)).accept('json');

/* CONTRACTS */

/**
 * @typedef {Object} ListContracts
 * @property {string} token
 * @property {number} [page]
 * @property {number} [limit]
 */

/**
 * List Contracts
 * @param {ListContracts} data 
 * @returns {Promise<{body:{data:Contract[]}}>}
 */
export const listContracts = (data) => {
	const { token, query } = splitObject(data, { queryElems: ['page', 'limit'] });
	return superagent.get(Root + '/my/contracts')
		.use(throttle.plugin(undefined))
		.query(query)
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * Deliver goods for a Contract
 * @param {{tradeSymbol: string, units: number, contractId: string, shipSymbol: string, token: string}} data 
 * @returns {Promise<{body:{data:{contract:Contract, cargo: Cargo}}}>}
 */
export const deliverContract = (data) => {
	const { token, path, body } = splitObject(data, { pathElems: ['contractId'] });
	return superagent.post(Root + Supplant("/my/contracts/{contractId}/deliver", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.send(body)
		.accept('json');
}

/**
 * Accept a Contract
 * @param {{contractId: string, token: string}} data 
 * @returns {Promise<{body:{data:{agent:Agent, contract: Contract}}}>}
 */
export const acceptContract = (data) => {
	const { token, path, body } = splitObject(data, { pathElems: ['contractId'] });
	return superagent.post(Root + Supplant("/my/contracts/{contractId}/accept", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.send(body)
		.accept('json');
}

/**
 * Fulfill a Contract
 * @param {{contractId: string, token: string}} data 
 * @returns {Promise<{body:{data:{agent:Agent, contract: Contract}}}>}
 */
export const fulfillContract = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['contractId'] });
	return superagent.post(Root + Supplant("/my/contracts/{contractId}/fulfill", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/* FLEET */

/**
 * @typedef {Object} ListShips
 * @property {string} token
 * @property {number} [page]
 * @property {number} [limit]
 */

/**
 * List ships
 * @param {ListShips} data 
 * @returns {Promise<{body:{data:Ship[]}}>}
 */
export const listShips = (data) => {
	const { token, query } = splitObject(data, { queryElems: ['page', 'limit'] });
	return superagent.get(Root + '/my/ships')
		.use(throttle.plugin(undefined))
		.query(query)
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * Get ship
 * @param {{shipSymbol: string, token: string}} data 
 * @returns {Promise<{body:{data:Ship}}>}
 */
export const getShip = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.get(Root + Supplant("/my/ships/{shipSymbol}", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * Orbit Ship
 * @param {{shipSymbol: string, token: string}} data 
 * @returns {Promise<{body:{data:Nav}}>}
 */
export const orbitShip = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.post(Root + Supplant("/my/ships/{shipSymbol}/orbit", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * Refuel Ship
 * @param {{shipSymbol: string, token: string}} data 
 * @returns {Promise<{body:{data:{agent:Agent,fuel:Fuel,transaction:Transaction}}}>}
 */
export const refuelShip = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.post(Root + Supplant("/my/ships/{shipSymbol}/refuel", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * Dock Ship
 * @param {{shipSymbol: string, token: string}} data 
 * @returns {Promise<{body:{data:Nav}}>}
 */
export const dockShip = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.post(Root + Supplant("/my/ships/{shipSymbol}/dock", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * Create Survey
 * @param {{shipSymbol: string, token: string}} data 
 * @returns {Promise<{body:{data:{cooldown:Cooldown,surveys:Survey[]}}}>}
 */
export const surveyShip = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.post(Root + Supplant("/my/ships/{shipSymbol}/survey", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * @typedef {Object} Survey
 */

/**
 * @typedef {Object} ExtractResources
 * @property {string} shipSymbol
 * @property {string} token
 * @property {Survey} [survey]
 */
/**
 * Extract Resources
 * @param {ExtractResources} data 
 * @returns {Promise<{body:{data:{cooldown:Cooldown, extraction:Extraction, cargo:Cargo}}}>}
 */
export const extractShip = (data) => {
	const { token, path, body } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.post(Root + Supplant("/my/ships/{shipSymbol}/extract", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.send(body)
		.accept('json');
}

/**
 * Sell Cargo
 * @param {{shipSymbol: string, token: string, symbol: string, units: number}} data 
 * @returns {Promise<{body:{data:{agent:Agent, cargo:Cargo, extraction:Extraction}}}>}
 */
export const sellShip = (data) => {
	const { token, path, body } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.post(Root + Supplant("/my/ships/{shipSymbol}/sell", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.send(body)
		.accept('json');
}

/**
 * Patch Ship Nav
 * @param {{shipSymbol: string, token: string, flightMode: string}} data 
 * @returns {Promise<{body:{data:Nav}}>}
 */
export const setShipNav = (data) => {
	const { token, path, body } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.patch(Root + Supplant("/my/ships/{shipSymbol}/nav", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.send(body)
		.accept('json');
}

/**
 * Navigate Ship
 * @param {{shipSymbol: string, token: string, waypointSymbol: string}} data 
 * @returns {Promise<{body:{data:{fuel:Fuel, nav:Nav}}}>}
 */
export const navigateShip = (data) => {
	const { token, path, body } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.post(Root + Supplant("/my/ships/{shipSymbol}/navigate", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.send(body)
		.accept('json');
}

/**
 * Transfer Cargo
 * @param {{shipSymbol: string, token: string, tradeSymbol:string, units:number, shipDestSymbol:string}} data 
 * @returns {Promise<{body:{data:{cargo:Cargo}}}>}
 */
export const transferShip = (data) => {
	const { token, path, body: { shipDestSymbol: shipSymbol, ...rest } } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.post(Root + Supplant("/my/ships/{shipSymbol}/transfer", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.send({ shipSymbol, ...rest })
		.accept('json');
}

/**
 * Get Ship Cargo
 * @param {{shipSymbol: string, token: string}} data 
 * @returns {Promise<{body:{data:Cargo}}>}
 */
export const getCargoShip = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.get(Root + Supplant("/my/ships/{shipSymbol}/cargo", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * Negotiate Contract
 * @param {{shipSymbol: string, token: string}} data 
 * @returns {Promise<{body:{data:{contract:Contract}}}>}
 */
export const negotiateContractShip = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['shipSymbol'] });
	return superagent.post(Root + Supplant("/my/ships/{shipSymbol}/negotiate/contract", path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/* SYSTEMS */

/**
 * List Systems
 * @param {{token: string, page:number, limit:number}} data 
 * @returns {Promise<{body:{data:System[]}}>}
 */
export const listSystems = (data) => {
	const { token, query } = splitObject(data, { queryElems: ['page', 'limit'] });
	return superagent.get(Root + '/systems')
		.use(throttle.plugin(undefined))
		.query(query)
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * List Waypoints
 * @param {{systemSymbol: string, token: string, page:number, limit:number}} data 
 * @returns {Promise<{body:{data:Waypoint[]}}>}
 */
export const waypointsSystems = (data) => {
	const { token, path, query } = splitObject(data, { pathElems: ['systemSymbol'], queryElems: ['page', 'limit'] });
	return superagent.get(Root + Supplant('/systems/{systemSymbol}/waypoints', path))
		.use(throttle.plugin(undefined))
		.query(query)
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * Get Waypoints
 * @param {{systemSymbol: string, waypointSymbol:string, token: string}} data 
 * @returns {Promise<{body:{data:Waypoint}}>}
 */
export const getWaypointSystems = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['systemSymbol', 'waypointSymbol'] });
	return superagent.get(Root + Supplant('/systems/{systemSymbol}/waypoints/{waypointSymbol}', path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/**
 * Get Market
 * @param {{systemSymbol: string, waypointSymbol:string, token: string}} data 
 * @returns {Promise<{body:{data:Market}}>}
 */
export const getMarket = (data) => {
	const { token, path } = splitObject(data, { pathElems: ['systemSymbol', 'waypointSymbol'] });
	return superagent.get(Root + Supplant('/systems/{systemSymbol}/waypoints/{waypointSymbol}/market', path))
		.use(throttle.plugin(undefined))
		.auth(token, { type: "bearer" })
		.accept('json');
}

/* DIV */

/**
 * @typedef {Object} CustomQuery
 * @property {string} Name 
 * @property {string} Method
 * @property {string} Root
 * @property {string} Path
 * @property {boolean} useAuth
 * @property {boolean} HasPathParams
 * @property {string} PathParams
 * @property {boolean} HasQueryParams
 * @property {string} QueryParams
 * @property {boolean} HasBody
 * @property {string} Body
 * @property {string} Answer
 * @property {string} token
 */

/**
 * Exexcute a custom query
 * @param {CustomQuery} data 
 * @returns 
 */
export const customQuery = (data) => {
	const url = data.Root.replace(/\/+$/, '') + (data.HasPathParams ? Supplant(data.Path, JSON.parse(data.PathParams)) : data.Path);
	let agent = superagent(data.Method, url);
	if (data.useAuth)
		agent	= agent.use(throttle.plugin(undefined));
		agent = agent.auth(data.token, { type: "bearer" })
	
	if (data.HasQueryParams)
		agent = agent.query(JSON.parse(data.QueryParams));
	
	if (data.HasBody)
		agent = agent.send(JSON.parse(data.Body));

	return agent.accept("json");
}
