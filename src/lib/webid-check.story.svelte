<script>
  import WebIdCheck from './webid-check.svelte'
  import { logEvent } from 'histoire/client'

  /**
   * @type {{ Story: any; Variant: any; Text: any; }}
   */
  export let Hst
</script>

<Hst.Story title="webid-check.svelte">
  <Hst.Variant title="long url">
    <div style="width: 10em">
      <WebIdCheck
        placeholder={'https://timbl.inrupt.net/profile/card#me'}
        on:valid-oidc-endpoint={(
          /** @type {{ type: string; detail: any; }} */ e,
        ) => logEvent(e.type, e.detail)}
      />
    </div>
  </Hst.Variant>
  <Hst.Variant title="short url">
    <WebIdCheck
      placeholder={'https://solid.fet.li'}
      on:valid-oidc-endpoint={(
        /** @type {{ type: string; detail: any; }} */ e,
      ) => logEvent(e.type, e.detail)}
    />
  </Hst.Variant>
</Hst.Story>
