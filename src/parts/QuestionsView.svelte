<script lang="ts">
	import {
		addQuestion,
		getQuestions,
		submitVote,
	} from "$lib/api";
	import { onMount } from "svelte";
	import QuestionEl from "./QuestionView.svelte";
	import type { Question } from "$lib/types";

	let questions: Question[] = [];

	onMount(async () => {
		questions = await getQuestions();
	});
</script>

<svelte:head>
	<title>Sci-Con</title>
	<meta name="description" content="sci-con" />
</svelte:head>

<section>
    {#each questions as question (JSON.stringify(question))}
        <QuestionEl
            {question}
            on:vote={async (e) => {
                questions = await submitVote({
                    qId: question.id,
                    vote: e.detail.vote,
                });
            }}
        />
    {/each}
    <button class="add" on:click={addQuestion}>+ add question</button>
</section>

<style>
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
