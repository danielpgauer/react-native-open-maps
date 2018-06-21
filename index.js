import React from 'react';
import { Linking, Platform } from 'react-native';

export default function open({latitude, longitude, zoomLevel, query, place_id, provider }) {
	// Execute link
  createOpenLink({ latitude, longitude, zoomLevel, query, provider, place_id })();
}

export function createOpenLink({latitude, longitude, zoomLevel = 15, query, place_id, provider }) {
	// Returns a delayed async function that opens when executed
	if (!provider) {
		defaultProvider = (Platform.OS === 'ios') ? 'apple' : 'google';
	}

	let mapProvider = provider || defaultProvider;
	// Allow override provider, otherwise use the default provider
	const mapLink = createMapLink({latitude, longitude, zoomLevel, query, place_id, provider: mapProvider });
	return async () => Linking.openURL(mapLink).catch(err => console.error('An error occurred', err));
}

export function createMapLink({latitude, longitude, zoomLevel = 15, query, place_id, provider = 'google'}) {
	const link = {
		'google': `https://www.google.com/maps/search/?api=1&zoom=${zoomLevel}`,
		'apple': `http://maps.apple.com/?ll=${latitude},${longitude}&z=${zoomLevel}`,
	};

	if (query) {
		link.google = link.google.concat('&', `query=${query}`);
		link.apple = link.apple.concat('&', `q=${query}`);
	} else {
		link.google = link.google.concat('&', place_id ? `query_place_id=${query_place_id}` : `query=${latitude},${longitude}`)
	}

	return encodeURI(link[provider]);
}
