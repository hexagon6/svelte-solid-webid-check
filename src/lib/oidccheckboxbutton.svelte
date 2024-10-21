<svelte:options runes={true} />

<script>
  let { children, url = '', validOidcEndpoint } = $props()

  const isUrl = (/** @type {string} */ url) => {
    try {
      const u = new URL(url)
      if (u.host === 'http' || u.host === 'https') {
        return false
      }
      return true
    } catch (e) {
      return false
    }
  }

  const securePrefix = 'https://'
  // if input has no scheme always use https://
  let secureUrl = $derived(
    url.length > 8
      ? url.startsWith(securePrefix)
        ? url
        : `${securePrefix}${url}`
      : `${securePrefix}${url}`,
  )
  let insecureUrl = $derived(url.startsWith('http://') ? url : '')
  let validURL = $derived(isUrl(secureUrl) || isUrl(insecureUrl))
  // allow http:// prefixed URL as input only if explicitly defined

  let loading = $state(false)

  /** @returns {null | Promise<null | string>}*/
  const checkOIDC = (/** @type {string | URL} */ url) => {
    if (!validURL) {
      return null
    }

    try {
      const { protocol, host } = new URL(url)
      loading = true
      // FIXME: use AbortController to stop ongoing requests if user continues typing
      return fetch(`${protocol}//${host}/.well-known/openid-configuration`, {
        method: 'get',
      })
        .then((res) => (res?.ok ? res.json() : null))
        .then((config) => {
          if (!config?.issuer) {
            return null
          }
          const issuer = new URL(config.issuer)
          return issuer.href
        })
        .catch(() => null)
        .finally(() => (loading = false))
    } catch (e) {
      return null
    }
  }

  /** @typedef {null | Promise<null | string>} MaybeURI*/
  /** @type {MaybeURI} */
  let hasOIDCIssuer = $state(null)
  $effect(() => {
    if (validURL) {
      hasOIDCIssuer = checkOIDC(insecureUrl ? insecureUrl : secureUrl)
    } else {
      hasOIDCIssuer = null
    }
  })
</script>

{#snippet checkmark(/** @type {boolean} */ oidc)}
  <div
    class="oidc-checkmark centered"
    class:valid-oidc={oidc}
    class:invalid-oidc={!oidc}
  ></div>
{/snippet}

{#snippet spinner()}
  <div class="oidc-checkmark centered spinner">⚙️</div>
{/snippet}

{#await hasOIDCIssuer}
  <button class="flex full-size centered" disabled={true}>
    {@render spinner()}
    {@render children()}
  </button>
{:then oidc}
  <button
    class="flex full-size centered"
    onclick={() =>
      validOidcEndpoint({
        userInput: url,
        oidcEndpoint: oidc,
      })}
    disabled={!oidc}
  >
    {#if loading}
      {@render spinner()}
    {:else}
      {@render checkmark(oidc)}
      {@render children()}
    {/if}
  </button>
{/await}

<style>
  button {
    max-width: fit-content;
    border-style: none;
  }

  .centered {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .full-size {
    width: 100%;
    height: 100%;
  }

  .flex {
    display: flex;
  }

  .oidc-checkmark {
    position: relative;
    user-select: none;
    padding-right: 0.3em;
  }

  .valid-oidc::after {
    content: '✅';
  }

  .invalid-oidc::after {
    content: '❎';
  }

  .spinner {
    animation: rotate 1.5s linear infinite;
  }
  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
</style>
