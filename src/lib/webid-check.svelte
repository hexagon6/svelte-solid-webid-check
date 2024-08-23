<script>
  import { createEventDispatcher } from 'svelte'
  import { pods } from './pods.mjs'
  import { stopTyping } from './helper.mjs'
  import OIDCheckboxButton from './oidccheckboxbutton.svelte'

  export let placeholder = 'https://inrupt.net'
  const dispatch = createEventDispatcher()

  $: inputURL = ''
  $: url = ''
  $: loading = false
</script>

<form>
  <label for="webid"><slot name="label">Choose your webid:</slot></label>
  <div class="centered contains-indicator">
    <input
      id="webid"
      type="text"
      class="full-size"
      on:input={(/** @type InputEvent */ i) => {
        console.log(i)
        if (i.inputType == 'insertReplacementText') {
          loading = true
          url = i?.target?.value || ''
        }
      }}
      use:stopTyping
      on:stopTyping={() => (url = inputURL)}
      on:click={() => (url = inputURL)}
      bind:value={inputURL}
      {placeholder}
      list="pods"
    />
    <OIDCheckboxButton
      {url}
      on:valid-oidc-endpoint={(e) => {
        console.log(e)
        dispatch(e.type, e.detail)
      }}
      ><slot name="confirm">set</slot>
    </OIDCheckboxButton>
    {#if pods}
      <datalist class="dropdown" id="pods">
        {#each pods as pod}
          <option value={pod}></option>
        {/each}
      </datalist>
    {/if}
  </div>
</form>

<style>
  * {
    box-sizing: border-box;
  }

  form {
    display: grid;
    gap: 1em;
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

  input {
    font-family: monospace;
    border: none;
    flex-grow: 2;
  }

  input:focus {
    outline: none;
  }

  .contains-indicator {
    border-color: inherit;
    border: 1px solid lightgray;
  }

  .contains-indicator:focus-within {
    outline: 1px solid lightblue;
  }

  .dropdown {
    position: relative;
    line-height: 2em;
    left: 0;
  }

  @media screen and (min-width: 448px) {
    form {
      grid-template-columns: 1fr 2fr 1fr;
    }
  }
</style>
