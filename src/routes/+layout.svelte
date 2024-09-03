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
		width: 800px;
		margin: 0 auto;
		box-sizing: border-box;
		padding-bottom: 50px;
	}
</style>
