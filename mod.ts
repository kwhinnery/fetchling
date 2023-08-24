/**
 * Fetchling is a hybrid type - it is both a function that can create new
 * subresources of a fetchling object, and an interface to interact with a
 * configured resource.
 */
export interface Fetchling {
  (path: string, init?: FRequestInit): Fetchling;
  fetch(init?: FRequestInit): Promise<FResponse>;
  fetchUrl(url: string | URL, init?: FRequestInit): Promise<FResponse>;
}

/**
 * FRequestInit is the configuration object for a Fetchling resource, based
 * on the RequestInit arguments to the fetch API. Any arguments that can be
 * passed to fetch() can be used to configure Fetchling requests.
 */
export interface FRequestInit extends RequestInit {
  /**
   * Whether or not fetchling should attempt to automatically parse the body
   * of a response, depending on the "Accept" header of the request. Defaults to
   * true.
   */
  parseBody?: boolean;

  /**
   * If set to true, automatically set the "Accept" header of the request to
   * "application/json". Also sets parseBody to true, so Fetchling will auto-
   * parse response bodies (as JSON). Default false.
   */
  json?: boolean;

  /**
   * A JavaScript object that should be serialized with JSON.stringify. Will
   * also set the "Content-Type" header of the request to "application/json".
   */
  //deno-lint-ignore no-explicit-any
  jsonBody?: any;

  /**
   * Argument to URLSearchParams that will be added to the request URL when the request is
   * made.
   */
  //deno-lint-ignore no-explicit-any
  query?: URLSearchParams | any;
}

/**
 * FResponse is a light wrapper around the Response object of the fetch() API.
 * It contains a few extra convenience fields, including the auto-parsed data
 * from a fetch request.
 */
export class FResponse extends Response {
  /**
   * Serialized response data from the Response body. Can be undefined if the
   * request was not successful, or if the response body was empty.
   */
  //deno-lint-ignore no-explicit-any
  data?: any;
}

const joinUrls = (...args: Array<string>) =>
  args
    .join("/")
    .replace(/[\/]+/g, "/")
    .replace(/^(.+):\//, "$1://")
    .replace(/^file:/, "file:/")
    .replace(/\/(\?|&|#[^!])/g, "$1")
    .replace(/\?/g, "&")
    .replace("&", "?");

/**
 * The Fetchling class provides a wrapper around the browser fetch() API,
 * storing a reusable request object, and exposing helper functions to access
 * nested sub-resources of the base URL.
 */
export class Fetchling {
  baseUrlArgument: string | URL;
  baseRequestInit: FRequestInit;

  /**
   * Factory method to create a new hybrid type Fetchling instance
   *
   * @param url
   * @param init
   * @returns Fetchling instance
   */
  static create(
    url: string | URL,
    init?: FRequestInit | undefined,
  ) {
    /*
      This is the chainable function that generates new Fetchlings as a
      subresource of the current Fetchling. Example:

      const api = f("http://localhost:8000", { json: true });
      const monkeys = api("monkeys.json");
      const { data } = monkeys.fetch();
    */
    const f = <Fetchling> function (
      this: Fetchling,
      __url: string | URL,
      __init?: FRequestInit,
    ): Fetchling {
      // Get the new URL, based on the current base
      const baseUrl = f.getUrl();
      const newUrl = joinUrls(baseUrl as string, __url as string);

      // Get new input params, based on the previous configuration
      const newInit: FRequestInit = Object.assign(
        {},
        f.baseRequestInit,
        __init,
      );

      return Fetchling.create(newUrl, newInit);
    };

    const cls = new Fetchling(url, init);
    Object.assign(f, cls);
    Object.setPrototypeOf(f, Fetchling.prototype);

    return f;
  }

  /**
   * Class constructor for a Fetchling instance.
   *
   * @param url - string or URL - the base resource
   * @param init (optional) - FRequestInit with fetch params
   */
  private constructor(
    url: string | URL,
    init?: FRequestInit,
  ) {
    // Create request configuration with defaults
    this.baseRequestInit = Object.assign({
      parseBody: true,
      json: false,
    }, init);

    // Store base URL argument for request construction
    this.baseUrlArgument = url;
  }

  /**
   * Internal helper to get the originally configured URL argument for the
   * fetch request.
   *
   * @returns a string or URL that was used to init the Fetchling instance
   */
  private getUrl(): string | URL {
    if (this.baseUrlArgument instanceof Request) {
      return this.baseUrlArgument.url;
    }

    return this.baseUrlArgument;
  }

  /**
   * Execute a "HEAD" request on the given Fetchling instance, with optional
   * configuration.
   *
   * @param init FRequestInit options for request
   * @returns promise with the response object
   */
  head(init?: FRequestInit): Promise<FResponse> {
    return this.doFetch(
      null,
      Object.assign({}, init, {
        method: "HEAD",
      }),
    );
  }

  /**
   * Execute a "PATCH" request on the given Fetchling instance, with optional
   * configuration.
   *
   * @param init FRequestInit options for request
   * @returns promise with the response object
   */
  patch(init?: FRequestInit): Promise<FResponse> {
    return this.doFetch(
      null,
      Object.assign({}, init, {
        method: "PATCH",
      }),
    );
  }

  /**
   * Execute a "PUT" request on the given Fetchling instance, with optional
   * configuration.
   *
   * @param init FRequestInit options for request
   * @returns promise with the response object
   */
  put(init?: FRequestInit): Promise<FResponse> {
    return this.doFetch(
      null,
      Object.assign({}, init, {
        method: "PUT",
      }),
    );
  }

  /**
   * Execute a "DELETE" request on the given Fetchling instance, with optional
   * configuration.
   *
   * @param init FRequestInit options for request
   * @returns promise with the response object
   */
  delete(init?: FRequestInit): Promise<FResponse> {
    return this.doFetch(
      null,
      Object.assign({}, init, {
        method: "DELETE",
      }),
    );
  }

  /**
   * Execute a "POST" request on the given Fetchling instance, with optional
   * configuration.
   *
   * @param init FRequestInit options for request
   * @returns promise with the response object
   */
  post(init?: FRequestInit): Promise<FResponse> {
    return this.doFetch(
      null,
      Object.assign({}, init, {
        method: "POST",
      }),
    );
  }

  /**
   * Execute a "GET" request on the given Fetchling instance, with optional
   * configuration.
   *
   * @param init FRequestInit options for request
   * @returns promise with the response object
   */
  get(init?: FRequestInit): Promise<FResponse> {
    return this.doFetch(
      null,
      Object.assign({}, init, {
        method: "GET",
      }),
    );
  }

  /**
   * Execute a fetch() with the given request and configuration on the Fetchling
   * class.
   *
   * @param url - override first fetch argument (url)
   * @param init (optional) - extend class' FRequestInit object
   * @returns Promise<FResponse> - response from the fetch() request
   */
  fetchUrl(
    url: string | URL,
    init?: FRequestInit,
  ): Promise<FResponse> {
    return this.doFetch(url, init);
  }

  /**
   * Execute a fetch() with optional config params. Example:
   *
   * const api = f("http://foo.com/endpoint", { json: true });
   * const { data } = await api.fetch({
   *  params: new URLSearchParams({ order_by: "date" });
   * });
   *
   * @param init (optional) - extend class' FRequestInit object
   * @returns Promise<FResponse> - response from the fetch() request
   */
  fetch(init?: FRequestInit): Promise<FResponse> {
    return this.doFetch(null, init);
  }

  /**
   * Execute a fetch() with the given request and configuration on the Fetchling
   * class.
   *
   * @param url (optional) - override first fetch argument (url)
   * @param init (optional) - extend class' FRequestInit object
   * @returns Promise<FResponse> - response from the fetch() request
   */
  private async doFetch(
    url?: string | URL | null,
    init?: FRequestInit,
  ): Promise<FResponse> {
    let urlArg = url ?? this.getUrl();
    const ini = init
      ? Object.assign({}, this.baseRequestInit, init)
      : this.baseRequestInit;

    // Handle JSON option
    if (ini.json) {
      ini.headers = Object.assign({}, ini.headers, {
        "Accept": "application/json",
      });
      ini.parseBody = true;
    }

    // Handle JSON body option
    if (ini.jsonBody) {
      ini.headers = Object.assign({}, ini.headers, {
        "Content-Type": "application/json",
      });
      ini.body = JSON.stringify(ini.jsonBody);
    }

    // Handle query params, if provided
    if (ini.query) {
      let qp = ini.query;
      if (!(qp instanceof URLSearchParams)) {
        qp = new URLSearchParams(qp);
      }

      const baseUrl = (urlArg instanceof URL) ? urlArg.href : urlArg;
      urlArg = baseUrl + "?" + qp.toString();
    }

    // Create new request with configuration options
    const request = new Request(urlArg, ini);

    // Attempt to execute fetch request
    const r = (await fetch(request)) as FResponse;

    // Helper function for debug logging on failed body parsing
    const logDebug = (m: string, e: Error) => {
      console.debug(m, request.url, "Method:", request.method, "Error:", e);
    };

    // Attempt to auto-parse response bodies, if configured - if there's no
    // body, r.data remains null and that's fine
    if (ini.parseBody) {
      const acceptHeader = request.headers.get("Accept");

      if (acceptHeader == "application/json") {
        // Auto-parse JSON
        try {
          r.data = await r.json();
        } catch (e) {
          logDebug("Failed to parse JSON body for request.", e);
        }
      } else if (acceptHeader == "application/octet-stream") {
        // Auto-parse a blob
        try {
          r.data = await r.blob();
        } catch (e) {
          logDebug("Failed to parse Blob body for request.", e);
        }
      } else {
        // Auto-parse text
        try {
          r.data = await r.text();
        } catch (e) {
          logDebug("Failed to parse text body for request.", e);
        }
      }
    }

    return r;
  }
}

/**
 * Create a new Fetchling instance using the given fetch() API arguments.
 *
 * @param url - string, Request, or URL - the base resource
 * @param init (optional) - FRequestInit or RequestInit object with fetch params
 */
export default function fetchling(
  url: string | URL,
  init?: FRequestInit | undefined,
): Fetchling {
  return Fetchling.create(url, init);
}
