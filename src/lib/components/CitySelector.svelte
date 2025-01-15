<script lang="ts">
  import { fade } from "svelte/transition";

  export let text: string;
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
  {#if searching}
    <form on:submit={handleSearch} class="search-box" transition:fade={{ duration: 200 }}>
      <input 
        id="search-input"
        type="text"
        placeholder="Enter location"
        bind:value={searchText}
        on:blur={() => { if (inputEmpty) searching = false; }}
        on:keydown={(event: KeyboardEvent) => { if (event.code == "Escape") searching = false; }}
        class="search-input"
      />
      
      <button type="submit" class="search-button" class:enabled={!inputEmpty}>search</button>
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

    transition: filter 300ms;
  }

  .city-name:focus-visible,
  .city-name:hover {
    filter: drop-shadow(0 0 0.25em #6490ff);
  }

  .edit-icon {
    font-size: 1.25rem;
    color: #808080;
    transition: opacity 300ms;
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
    display: flex;
    align-items: center;

    /*width: fit-content;
    margin: 0 auto;*/

    grid-column: 1;
    grid-row: 1;

    border-radius: 0.75em;
    border: 1px solid transparent;
    border-color: #ccc;
    transition: border-color 200ms;

    background-color: #f8f8f8;
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

  .search-button {
    font-family: 'Material Symbols Outlined';
    padding: 0.5rem;
    font-size: 1.25rem;
    line-height: 1.25rem;
    transition: filter 300ms, color 300ms;
    
    border: none;
    outline: none;
    background: none;

    color: #aaa;
  }

  .search-button.enabled {
    color: #444;
    cursor: pointer;
  }

  .search-button.enabled:is(:focus-visible, :hover) {
    filter: drop-shadow(0 0 0.25em #6490ff);
  }
</style>
