import {isFunction} from './util';

// This module contains:
// - built-in annotation classes
// - helpers to read/write annotations

export interface IClassInterface<T>
{
  new (...params: any[]): T;
}

// ANNOTATIONS

/**
* A built-in token.
* Used to ask for pre-injected parent constructor.
* A class constructor can ask for this.
*/
export class SuperConstructor {}

/**
* A built-in scope.
* Never cache.
*/
export class TransientScope {}

export class InjectDecorator
{
  tokens: IClassInterface<any>[];
  isPromise: boolean;
  isLazy: boolean;

  constructor(...tokens: IClassInterface<any>[])
  {
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = false;
  }
}

export class InjectPromiseDecorator extends InjectDecorator
{
  constructor(...tokens: IClassInterface<any>[])
  {
    super();
    this.tokens = tokens;
    this.isPromise = true;
    this.isLazy = false;
  }
}

export class InjectLazyDecorator extends InjectDecorator
{
  constructor(...tokens: IClassInterface<any>[])
  {
    super();
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = true;
  }
}

export class ProvideDecorator
{
  token: IClassInterface<any>;
  isPromise: boolean;

  constructor(token: IClassInterface<any>)
  {
    this.token = token;
    this.isPromise = false;
  }
}

export class ProvidePromiseDecorator extends ProvideDecorator
{
  token: IClassInterface<any>;
  isPromise: boolean;

  constructor(token: IClassInterface<any>)
  {
    super(token);
    this.token = token;
    this.isPromise = true;
  }
}

export class ClassProvider {}
export class FactoryProvider {}


// HELPERS

export interface Fn
{
  annotations ?: (InjectDecorator | ProvideDecorator)[];
  parameters? : any[]
}

/**
 * Append annotation on a function or class.
 * This can be helpful when not using ES6+.
 */
export function annotate( fn: Fn, annotation: InjectDecorator | ProvideDecorator )
{
  fn.annotations = fn.annotations || [];
  fn.annotations.push(annotation);
}

/**
 * Read annotations on a function or class and return whether given annotation is present.
 */
export function hasAnnotation(fn: Fn, annotationClass: any)
{
  if ( !fn.annotations || fn.annotations.length === 0 )
  {
    return false;
  }

  for (let annotation of fn.annotations)
  {
    if (annotation instanceof annotationClass)
    {
      return true;
    }
  }

  return false;
}


/**
 * Read annotations on a function or class and collect "interesting" metadata.
 */
export function readAnnotations(fn: Fn)
{
  let collectedAnnotations: {provide: ProvideDecorator, params: (ProvideDecorator | InjectDecorator)[]} =
  {
    /**
     * Description of the provided value.
     */
    provide:
    {
      token: null,
      isPromise: false
    },

    /**
     * List of parameter descriptions.
     * A parameter description is an object with properties:
     * - token (anything)
     * - isPromise (boolean)
     * - isLazy (boolean)
     */
    params: []
  };

  if ( fn && (typeof fn.annotations === 'object') )
  {
    for (let annotation of fn.annotations)
    {
      if (annotation instanceof InjectDecorator)
      {
        annotation.tokens.forEach( <T>(token: IClassInterface<T>) =>
        {
          collectedAnnotations.params.push({
            token: token,
            isPromise: annotation.isPromise,
            isLazy: annotation.isLazy
          });
        });
      }

      if (annotation instanceof ProvideDecorator)
      {
        collectedAnnotations.provide.token = annotation.token;
        collectedAnnotations.provide.isPromise = annotation.isPromise;
      }
    }
  }

  // Read annotations for individual parameters.
  if (fn.parameters)
  {
    fn.parameters.forEach((param, idx) =>
    {
      for (let paramAnnotation of param)
      {
        // Type annotation.
        if ( isFunction(paramAnnotation) && !collectedAnnotations.params[idx] )
        {
          collectedAnnotations.params[idx] =
          {
            token: paramAnnotation,
            isPromise: false,
            isLazy: false
          };
        }
        else if (paramAnnotation instanceof InjectDecorator)
        {
          collectedAnnotations.params[idx] =
          {
            token: paramAnnotation.tokens[0],
            isPromise: paramAnnotation.isPromise,
            isLazy: paramAnnotation.isLazy
          };
        }
      }
    });
  }

  return collectedAnnotations;
}

/**
 * Decorator versions of annotation classes
 */
export function Inject(...tokens: IClassInterface<any>[])
{
  return function(fn: Fn)
  {
    annotate(fn, new InjectDecorator(...tokens));
  };
}

export function InjectPromise(...tokens: IClassInterface<any>[])
{
  return function(fn: Fn)
  {
    annotate(fn, new InjectPromiseDecorator(...tokens));
  };
}

export function InjectLazy(...tokens: IClassInterface<any>[])
{
  return function(fn: Fn)
  {
    annotate(fn, new InjectLazyDecorator(...tokens));
  };
}

export function Provide(token: IClassInterface<any>)
{
  return function(fn: Fn)
  {
    annotate(fn, new ProvideDecorator(token));
  };
}

export function ProvidePromise(token: IClassInterface<any>)
{
  return function(fn: Fn)
  {
    annotate(fn, new ProvidePromiseDecorator(token));
  };
}
