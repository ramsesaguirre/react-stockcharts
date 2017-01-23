"use strict";

import { rebind } from "d3fc-rebind";

import { merge } from "../utils";

import { sar } from "../calculator";

import baseIndicator from "./baseIndicator";

const ALGORITHM_TYPE = "SMA";

export default function() {

	var base = baseIndicator()
		.type(ALGORITHM_TYPE)
		.accessor(d => d.sar);

	var underlyingAlgorithm = sar();

	var mergedAlgorithm = merge()
		.algorithm(underlyingAlgorithm)
		.merge((datum, indicator) => { datum.sar = indicator; });

	var indicator = function(data, options = { merge: true }) {
		if (options.merge) {
			if (!base.accessor()) throw new Error(`Set an accessor to ${ALGORITHM_TYPE} before calculating`);
			return mergedAlgorithm(data);
		}
		return underlyingAlgorithm(data);
	};

	rebind(indicator, base, "id", "accessor", "stroke", "echo", "type");
	rebind(indicator, underlyingAlgorithm, "undefinedLength");
	rebind(indicator, underlyingAlgorithm, "options");
	rebind(indicator, mergedAlgorithm, "merge");

	return indicator;
}