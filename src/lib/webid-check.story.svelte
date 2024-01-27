<script>
  import WebIdCheck from './webid-check.svelte'
  import { logEvent } from 'histoire/client'

  /**
   * @type {{ Story: any; Variant: any; Text: any; }}
   */
  export let Hst
</script>

<svelte:component this={Hst.Story} title="webid-check.svelte">
  <svelte:component this={Hst.Variant} title="no slot">
    <WebIdCheck
      placeholder={'https://timbl.inrupt.net/profile/card#me'}
      on:valid-oidc-endpoint={(
        /** @type {{ type: string; detail: any; }} */ e,
      ) => logEvent(e.type, e.detail)}
    />
  </svelte:component>
  <svelte:component this={Hst.Variant} title="custom slots">
    <WebIdCheck
      placeholder={'https://solid.fet.li'}
      on:valid-oidc-endpoint={(
        /** @type {{ type: string; detail: any; }} */ e,
      ) => logEvent(e.type, e.detail)}
      ><span slot="label">this is the input for the webid</span>
      <span slot="confirm">please confirm your selection</span>
    </WebIdCheck>
  </svelte:component>
</svelte:component>
