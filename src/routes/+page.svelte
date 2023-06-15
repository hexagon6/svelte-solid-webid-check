<script>
  import WebIdCheck from '$lib/webid-check.svelte'

  $: validOIDCEndpoint = ''
</script>

<main>
  <section>
    <h2>WebIdCheck</h2>
    <form>
      Type in your webId to check whether there is an openid connect endpoint
      available
      <WebIdCheck
        placeholder={'https://timbl.inrupt.net/profile/card#me'}
        on:valid-oidc-endpoint={({ detail: { oidcEndpoint } }) => {
          validOIDCEndpoint = oidcEndpoint
        }}>show</WebIdCheck
      >
    </form>

    {#if validOIDCEndpoint}
      <p>
        The OpenID Connect Endpoint is at <a href={validOIDCEndpoint}
          >{validOIDCEndpoint}</a
        >
      </p>
    {/if}
  </section>
</main>
