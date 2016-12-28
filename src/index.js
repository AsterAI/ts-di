// PUBLIC API
"use strict";
var injector_1 = require("./injector");
exports.Injector = injector_1.Injector;
var annotations_1 = require("./annotations");
exports.annotate = annotations_1.annotate;
exports.InjectDecorator = annotations_1.InjectDecorator;
exports.InjectLazyDecorator = annotations_1.InjectLazyDecorator;
exports.InjectPromiseDecorator = annotations_1.InjectPromiseDecorator;
exports.ProvideDecorator = annotations_1.ProvideDecorator;
exports.ProvidePromiseDecorator = annotations_1.ProvidePromiseDecorator;
exports.SuperConstructor = annotations_1.SuperConstructor;
exports.TransientScope = annotations_1.TransientScope;
exports.ClassProvider = annotations_1.ClassProvider;
exports.FactoryProvider = annotations_1.FactoryProvider;
exports.Inject = annotations_1.Inject;
exports.InjectPromise = annotations_1.InjectPromise;
exports.InjectLazy = annotations_1.InjectLazy;
exports.Provide = annotations_1.Provide;
exports.ProvidePromise = annotations_1.ProvidePromise;
