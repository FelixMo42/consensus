<svelte:head>
	<title>Admin</title>
	<meta name="description" content="Admin dashboard" />
</svelte:head>

<script lang="ts">
    import { onMount } from "svelte"
    import { addQuestion, getQuestions, removeQuestion } from "$lib/api"
	import { type Question } from "$lib/types"

	let questions: Question[] = []
	let newQuestion = ""

	onMount(async () => {
		questions = await getQuestions()
	})
</script>

<section>
	<h1>Admin</h1>

	{#each questions as question}
		<div class="row">
			<h3 class="flex">{question.question}</h3>
			<button
				class="button dangerous"
				on:click={async () => {
					questions = await removeQuestion(question.id)
				}}
			>DELETE</button>
		</div>
	{/each}
	<div class="row">
		<textarea
			placeholder="Enter question"
			bind:value={newQuestion}
		/>
		<button
			class="button"
			on:click={async () => {
				questions = await addQuestion(newQuestion) ?? questions
				newQuestion = ""
			}}
		>ADD</button>
	</div>
</section>

<style>
	h3 {
		opacity: 80%;
	}

	.row {
		padding: 10px 0px;
		border-bottom: 1px solid gray;
		justify-content: center;
		align-items: center;
	}

	textarea {
		min-height: 45px;
		box-sizing: border-box;
		border: none;
		resize: vertical;
		background: none;
		display: block;
		width: 100%;
		outline: none;
		color: var(--color-text);
		font-size: 1.15rem;
		font-family: var(--font-body);
	}
</style>
