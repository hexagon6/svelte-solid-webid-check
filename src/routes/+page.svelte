<svelte:options runes={true} />

<script>
  import WebIdCheck from '$lib/webid-check.svelte'

  let validOIDCEndpoint = $state('')
  const setUrl = ({oidcEndpoint}) => {
    validOIDCEndpoint = oidcEndpoint
  }
</script>

<main>
  <h2>WebIdCheck Component Example</h2>
  <span>Type in your webId to check whether there is an openid connect endpoint available</span>
  {#if validOIDCEndpoint}
  <section>
      <p>
        The OpenID Connect Endpoint is at <a href={validOIDCEndpoint}
          >{validOIDCEndpoint}</a
        >
      </p>
  </section>
    {/if}
  <h3>Default Component</h3>
  <section>

    <WebIdCheck
    validOIDCEndpoint={setUrl}>
  </WebIdCheck>
  </section>
  <h3>Variant with "placeholder", "confirm" and "label"</h3>
  <pre>&lt;WebIdCheck
  placeholder="https://timbl.inrupt.net/profile/card#me"
  validOIDCEndpoint=&#123;setUrl&#125;
&gt;
  &#123;#snippet&#125;confirm()confirm&#123;/snippet&#125;
  &#123;#snippet&#125;label()&#125;label&#123;/snippet&#125;
&lt;/WebIdCheck&gt;</pre>
  <section>
    <WebIdCheck
        placeholder="https://timbl.inrupt.net/profile/card#me"
        validOIDCEndpoint={setUrl}
        >
        {#snippet confirm()}confirm{/snippet}
        {#snippet label()}label{/snippet}
    </WebIdCheck>
  </section>


</main>

<style>
  * {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }

  section, pre {
    display: flex;
    margin: 2em;
    padding: 1em;
    box-shadow: lightgray 1px 1px 2em;
    border-radius: 0.2em;
  }

  pre {
    padding: 1em 1em;
  }
</style>
