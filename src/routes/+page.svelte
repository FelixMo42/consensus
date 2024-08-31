<script>
	import Question from "../Question.svelte";

	async function getQuestions() {
		const questions = await fetch("/questions")
			.then(res => res.json())

		return questions
	}

	const questions = getQuestions()

	async function addQuestion() {
		const question = prompt("Question?")
		await fetch("/questions", {
			method: "POST",
			body: JSON.stringify({
				question
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		location.reload()
	}
</script>

<svelte:head>
	<title>Sci-Con</title>
	<meta name="description" content="sci-con" />
</svelte:head>

<section>
	<h1>Scientific Consensus</h1>
	{#await questions then qs}
		{#each qs as question}
			<Question {question} />
		{/each}
	{/await}
	<button class="add" on:click={addQuestion}>+ add question</button>
</section>

<style>
	h1 {
		text-decoration: underline;
	}

	.add {
		border: none;
		background: none;
		color: white;
		font-size: 1.25em;
		padding: 10px;
		display: block;
		width: 100%;
		text-align: center;
		cursor: pointer;
	}

	.add:hover {
		text-decoration: underline;
	}
</style>
