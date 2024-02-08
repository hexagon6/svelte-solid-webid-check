<script>
  import { createEventDispatcher } from 'svelte'

  export let url = ''

  const dispatch = createEventDispatcher()

  const isUrl = (/** @type {string} */ url) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const prefix = 'https://'
  $: secureUrl =
    url.length > 8
      ? url.startsWith(prefix)
        ? url
        : `${prefix}${url}`
      : `${prefix}${url}`
  $: validURL = isUrl(secureUrl)
  $: hasOIDCIssuer = validURL ? checkOIDC(secureUrl) : false
  $: loading = false

  const checkOIDC = (/** @type {string | URL} */ url) => {
    if (!validURL) {
      return false
    }

    try {
      const { protocol, host } = new URL(url)
      loading = true
      // FIXME: use AbortController to stop ongoing requests if user continues typing
      return fetch(`${protocol}//${host}/.well-known/openid-configuration`, {
        method: 'get',
      })
        .then((res) => (res?.ok ? res.json() : false))
        .then((config) => {
          if (!config?.issuer) {
            return false
          }
          const issuer = new URL(config.issuer)
          return issuer.href
        })
        .catch(() => false)
        .finally(() => (loading = false))
    } catch (e) {
      return false
    }
  }
</script>

{#await hasOIDCIssuer}
  <button class="flex full-size centered" disabled={true}>
    <div class="oidc-checkmark centered spinner">⚙️</div>
    <slot name="confirm">set</slot>
  </button>
{:then oidc}
  <button
    class="flex full-size centered"
    on:click|preventDefault={() => {
      dispatch('valid-oidc-endpoint', {
        userInput: url,
        oidcEndpoint: oidc,
      })
    }}
    disabled={!oidc}
  >
    {#if loading}
      <div class="oidc-checkmark centered spinner">⚙️</div>
    {:else}
      <div
        class="oidc-checkmark centered"
        class:valid-oidc={oidc}
        class:invalid-oidc={!oidc}
      />
    {/if}
    <slot name="confirm">set</slot>
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
