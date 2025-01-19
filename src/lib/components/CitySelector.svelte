<script lang="ts">
  import { fade } from "svelte/transition";

  export let text: string | undefined;
  export let search: (searchText: string) => void;
  export let searching = false;

  let searchText = '';
  
  let inputEmpty: boolean;
  $: inputEmpty = !searchText.trim();

  function showSearch() {
    searching = true;
    setTimeout(() => {
      document.getElementById('search-input')?.focus();
    }, 0);
  }
  function handleSearch(event: SubmitEvent) {
    if (!inputEmpty) search(searchText.trim());
    event.preventDefault(); // Prevent form submission
  }
</script>

<div class="container">
  {#if searching || !text}
    <form on:submit={handleSearch} class="search-box" class:initial={!text} transition:fade={{ duration: 200 }}>
      <input 
        id="search-input"
        type="text"
        placeholder="Search"
        bind:value={searchText}
        on:blur={() => { if (inputEmpty) searching = false; }}
        on:keydown={(event: KeyboardEvent) => { if (event.code == "Escape") searching = false; }}
        class="search-input"
        required
      />
      
      <button type="submit" class="search-button" class:enabled={!inputEmpty}>search</button>

      {#if text}
        <button type="button" on:click={()=>{ searching = false; }} class="material-symbols close-button button shadow-on-focus">close</button>
      {/if}
    </form>
  {:else}
    <button on:click={showSearch} class="city-name" transition:fade={{ duration: 200 }}>
      {text}
      <span class="material-symbols edit-icon">edit</span>
    </button>
  {/if}
</div>

<style>
  .container {
    display: grid;
    place-items: center;
    height: 4em;
  }

  .city-name {
    position: relative;
    font-size: 1.5rem;
    font-weight: 500;
    /*padding: 0.25rem;*/
    padding: 0;

    grid-column: 1;
    grid-row: 1;

    border: none;
    outline: none;
    background: none;

    transition: filter 250ms;
  }

  .city-name:focus-visible,
  .city-name:hover {
    filter: drop-shadow(0 0 0.25em #6490ff);
  }

  .edit-icon {
    font-size: 1.25rem;
    color: #808080;
    transition: opacity 250ms;
    opacity: 0;
    margin-left: 0.25rem;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .city-name:is(:focus-visible, :hover) .edit-icon {
    opacity: 1;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;

    /*width: fit-content;
    margin: 0 auto;*/

    grid-column: 1;
    grid-row: 1;

    border-radius: 0.75em;
    border: 1px solid transparent;
    border-color: #ccc;
    transition: border-color 250ms;

    background-color: #f8f8f8;
  }

  .search-box.initial {
    border-radius: 1.125rem;
  }

  .search-box:focus-within {
    border-color: #6490ff;
  }

  .search-input {
    border: none;
    outline: none;
    background: none;
    font-size: 1rem;
    line-height: 1.25rem;
    padding: 0.5rem 0.75rem;
    /*flex: 1;*/
  }

  .search-box.initial .search-input {
    width: 25em;
  }

  .search-button {
    font-family: 'Material Symbols Outlined';
    padding: 0.5rem;
    font-size: 1.25rem;
    line-height: 1;
    transition: filter 250ms, color 250ms;
    cursor:default;

    border: none;
    outline: none;
    background: none;

    color: #aaa;
  }

  .search-button.enabled {
    color: #444;
    cursor: pointer;
  }

  .close-button {
    position:absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);

    padding: 0.5rem;
    font-size: 1.25rem;
    line-height: 1;
  }

  .search-button.enabled:is(:focus-visible, :hover) {
    filter: drop-shadow(0 0 0.25em #6490ff);
  }
</style>
