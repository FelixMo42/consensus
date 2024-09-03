<script lang="ts">
	import { getQuestions, submitVote } from "$lib/api";
	import { onMount } from "svelte";
	import QuestionEl from "./QuestionView.svelte";
	import type { Question } from "$lib/types";

	let questions: Question[] = [];

	onMount(async () => {
		questions = await getQuestions();
	});
</script>

<div>
    {#each questions as question (JSON.stringify(question))}
        <QuestionEl
            {question}
            on:vote={async (e) => {
                questions = await submitVote(
                    question.id,
                    e.detail.vote,
                );
            }}
        />
    {/each}
</div>
