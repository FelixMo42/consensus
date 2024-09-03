<script>
	import '../app.css'
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		
		max-width: 800px;
		max-width: 100vw;
		width: 800px;

		padding: 10px;

		margin: 0 auto;
		box-sizing: border-box;
		padding-bottom: 50px;
	}
</style>
