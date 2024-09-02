<script lang="ts">
	import { addQuestion, getQuestions, submitVote } from "$lib/lib";
	import { onMount } from "svelte";
	import QuestionEl from "../QuestionEl.svelte";
	import type { Question } from "$lib/types";

	let userId = "";
	let questions: Question[] = [];

	onMount(async () => {
		userId = localStorage.getItem("user") || "";
		questions = await getQuestions();
	});
</script>

<svelte:head>
	<title>Sci-Con</title>
	<meta name="description" content="sci-con" />
</svelte:head>

<section>
	<h1>Scientific Consensus</h1>
	<button>log in</button>
	{#each questions as question}
		<QuestionEl
			{question}
			on:vote={async (e) => {
				questions = await submitVote({
					userId,
					qId: question.id,
					vote: e.detail.vote,
				});
			}}
		/>
	{/each}
	<button class="add" on:click={addQuestion}>+ add question</button>
</section>

<style>
	h1 {
		text-decoration: underline;
		margin-bottom: 0px;
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
