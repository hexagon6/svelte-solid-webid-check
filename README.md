# @hexagon6/svelte-solid-webid-check

## Purpose

A Svelte component which can do [OpenID Connect Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig).

It is usefull to check where a solid [webId](https://solidproject.org/TR/oidc#concepts-webids) is being [authenticated](https://solid.github.io/webid-profile/#identity-provider) (OpenID Connect Identity Provider, by reading the contents of /.well-known/openid-configuration as defined in https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig).

This component can be used to help application developers guide users to set their webId url, for a quick validation on input. It should make it easier to set up a webID-based login for solid applications with svelte / sveltekit.

## Example usage

```svelte
<script>
  import WebIdCheck from '@hexagon6/svelte-solid-webid-check'
</script>

<WebIdCheck
  placeholder={'https://timbl.inrupt.net/profile/card#me'}
  on:valid-oidc-endpoint={({ detail: { oidcEndpoint } }) => {
    validOIDCEndpoint = oidcEndpoint
  }}>show</WebIdCheck
>
```

For more examples check out this repo and check out histoire with `npm run story:dev` or a sveltekit example with `npm run dev`.
