<script>
  import { createEventDispatcher } from 'svelte'
  import { pods } from './pods.mjs'

  export let placeholder = 'https://inrupt.net'
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
  $: url = ''
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
      // FIXME: use AbortController and debounce to prevent too many requests
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

<div class="input-wrapper">
  <input type="text" bind:value={url} {placeholder} list="pods" />
  {#if loading}<span class="oidc-checkmark spinner">⚙️</span>{/if}
  {#await hasOIDCIssuer then oidc}
    {#if !loading}
      <span class="oidc-checkmark">{oidc ? '✅' : '❎'}</span>
      {#if oidc}
        <button
          on:click|preventDefault={() => {
            dispatch('valid-oidc-endpoint', {
              userInput: url,
              oidcEndpoint: oidc,
            })
          }}
          disabled={!validURL}><slot>set</slot></button
        >
      {/if}
    {/if}
  {/await}
</div>
{#if pods}
  <datalist class="dropdown" id="pods">
    {#each pods as pod}
      <option value={pod} />
    {/each}
  </datalist>
{/if}

<style>
  input {
    font-family: monospace;
    width: auto;
    min-width: 40em;
  }
  .spinner {
    animation: rotate 1.5s linear infinite;
  }
  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
  .oidc-checkmark {
    position: relative;
    left: -1.2em;
    user-select: none;
  }
  .input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }
</style>
