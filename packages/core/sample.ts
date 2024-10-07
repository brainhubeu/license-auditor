// A file to test out TS&Biome configs
import { EventEmitter } from "events";
import * as http from "http";
import { readFileSync } from "fs"; // Unused import

enum Colors {
	Red = 1,
	Green,
	Blue,
}

namespace Utils {
	export function log(message) {
		// Missing type annotation for 'message'
		console.log(message);
	}
}

class BaseClass {
	constructor() {
		// Empty constructor
	}

	deprecatedMethod() {
		console.log("This method is deprecated.");
	}
}

interface IAdvanced<T> {
	data: T;
	process(input: T): T;
}

class AdvancedClass<T> extends BaseClass implements IAdvanced<T> {
	data: T; // Missing access modifier

	constructor(data: T) {
		super();
		this.data = data;
	}

	async process(input) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return input;
	}

	@deprecated // Using decorator without proper implementation
	oldFunction() {
		this.deprecatedMethod();
	}
}

let instance = new AdvancedClass<number>(42);
instance.process(100).then((result) => {
	Utils.log("Processed result: " + result);
});

let colorName: string = Colors[2]; // Accessing enum by index

function doSomething<T>(arg: T): T {
	return arg;
}

let output = doSomething<string>("Test");

function assertionExample(value: any) {
	let length = (<string>value).length; // Using type assertion
}

assertionExample(1234);

type UnionType = string | number | boolean;

let unionVar: UnionType = true;
unionVar = "Now I am a string";
unionVar = 42;

// Incorrectly implemented promise
function getData(): Promise<string> {
	return new Promise((resolve, reject) => {
		// Missing resolve or reject
	});
}

getData()
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});

// TypeScript code with potential runtime error
function riskyOperation(value: number) {
	if (value > 0) {
		return value.toString();
	}
	// Missing return statement for other code paths
}

let result = riskyOperation(-1);

// Inconsistent naming conventions
class my_class {
	MyProperty: string;

	constructor(prop: string) {
		this.MyProperty = prop;
	}
}

let obj = new my_class("test");

// Use of 'var' in loops and scopes
for (var i = 0; i < 5; i++) {
	setTimeout(() => console.log(i), 100);
}

// Incorrect module import/export
export default function () {
	console.log("Default export function");
}

import defaultFunc from "./sample"; // Circular import

defaultFunc();

// Unnecessary escape characters in regex
let regex = new RegExp("\\d+");
