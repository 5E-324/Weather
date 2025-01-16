<script lang="ts">
  //import svelteLogo from './assets/svelte.svg'
  //import viteLogo from '/vite.svg'
  //import Counter from './lib/Counter.svelte'
  import CitySelector from "./lib/components/CitySelector.svelte";
  import { type OpenWeatherMapResponse } from "./lib/types";
    import { getWeatherIconName } from "./lib/weather-icon-map";

  let currentCity: string | undefined;
  let searching = false;
  let useCelsius = true;

  let weatherPromise: Promise<OpenWeatherMapResponse> | undefined = undefined;

  function temperatureToString(kelvin: number) {
    if (useCelsius) {
      return (kelvin - 273.15).toFixed(1);
    } else {
      return ((kelvin - 273.15) * (9/5) + 32).toFixed(1);
    }
  }

  function handleSearch(searchText: string) {
    console.log('Searching for:', searchText);
    weatherPromise = getWeather(searchText);
    currentCity = searchText;
    searching = false;
  }

  async function getWeather(cityName: string) {
    let response = await fetch(`http://localhost:3000/weather?q=${cityName}`); // TEMPORARY
    
    if (!response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        let data = await response.json();
        if (data.message) throw Error(data.message);
      } else {
        let text = await response.text();
        if (text) throw Error(text);
      }

      throw Error(`${response.status} ${response.statusText}`);
    }

    let data: OpenWeatherMapResponse = await response.json();
    currentCity = data.name;
    console.log(data);
    return data;
  }
</script>

<header style="padding: 1em;">
  <CitySelector text={currentCity ?? "Click to select city"} search={handleSearch} bind:searching></CitySelector>
</header>

{#if weatherPromise != undefined}
  {#await weatherPromise}
    <p>loading...</p>
  {:then weatherData}
    {@const weather = weatherData.weather[0]}
    {@const main = weatherData.main}
    {@const sys = weatherData.sys}
    {@const isDay = weatherData.dt > sys.sunrise && weatherData.dt < sys.sunset}
    <div>
      <!--img src="https://openweathermap.org/img/wn/{weather.icon}@2x.png" alt="" width="100" height="100"/-->
      <img src="weather-icons/{getWeatherIconName(weather.id, isDay)}.svg" alt="" style="height: 8em;" />
      <div class="current-temperature">
        {temperatureToString(main.temp)}
        <button class="temperature-unit-container" on:click={() => { useCelsius = !useCelsius; }}>
          <div class="temperature-unit">{useCelsius ? "\u2103" : "\u2109"}</div><!--Celsius-->
          <div class="material-symbols show-on-hover">swap_horiz</div>
          <div class="temperature-unit show-on-hover">{useCelsius ? "\u2109" : "\u2103"}</div><!--Fahrenheit-->
        </button>
      </div>
      <div>
        <span>{weather.main}</span>
        <span>
          {temperatureToString(main.temp_max)}&#176;
          <span>/</span>
          {temperatureToString(main.temp_min)}&#176;
        </span>
      </div>
    </div>
  {:catch error}
    <p style="color: red">Error: {error.message}</p>
  {/await}
{/if}

<style>
  .current-temperature {
    position: relative;
    font-size: 4em;
    line-height: 1;
    margin: 0 auto 0.25em;
    width: fit-content;
  }
  .temperature-unit-container {
    border: none;
    outline: none;
    background: none;
    padding: 0;

    position: absolute;
    top: 0.1em;
    left: calc(100% + 0.1em);
    font-size: 0.4em;
    display: flex;

    transition: filter 300ms;
  }

  .temperature-unit-container:is(:focus-visible, :hover) {
    filter: drop-shadow(0 0 0.25em #6490ff);
  }
  .temperature-unit {
    font-weight: bold;
  }
  .show-on-hover {
    opacity: 0;
    transition: opacity 300ms;
  }

  .temperature-unit-container:is(:focus-visible, :hover) .show-on-hover {
    opacity: 1;
  }
</style>

<!--main>
  <div>
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main-->

<!--style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style-->
