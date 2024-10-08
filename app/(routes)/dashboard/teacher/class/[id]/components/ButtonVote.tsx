'use client'
import { useState, MouseEvent } from "react";
import ModalVote from "./ModalVote";
import { createClient } from "utils/supabase/client";

export interface ISubject {
	id: string;
	subject: string;
}

interface IButtonVote {
	subjects: ISubject[];
	id: string;
	classID: string;
	date: string;
}

export default function ButtonVote({ subjects, id, classID, date }: IButtonVote) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedSubject, setSelectedSubject] = useState<string>('');
	const [rating, setRating] = useState<number | null>(null);
	const [successfully, setSuccessfully] = useState(false)

	function handleSubjectChange(e: React.ChangeEvent<HTMLSelectElement>) {
		setSelectedSubject(e.target.value);
	}

	function handleRatingChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = parseFloat(e.target.value);
		setRating(isNaN(value) ? null : value);
	}

	async function handleSubmit(e: MouseEvent, date: string) {
		setSuccessfully(false)
		const supabase = createClient();
		await supabase
			.from('grades')
			.insert([
				{
					student_id: e.currentTarget.id,
					class_id: classID,
					subjects: selectedSubject,
					grade: rating,
					date: date,
				},
			])
			.select();
		setSuccessfully(true)
		setTimeout(() => {
			window.location.reload();
		}, 500)
	}

	const uniqueSubjects = subjects.filter(
		(subject, index, self) =>
			index === self.findIndex((s) => s.subject === subject.subject)
	);

	return (
		<>
			<button
				className="inline-block rounded-lg bg-color60 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:bg-color80 focus:opacity-85 active:opacity-85 disabled:pointer-events-none disabled:opacity-50"
				onClick={() => setIsOpen(true)}
			>
				Add
			</button>
			<ModalVote onClose={() => setIsOpen(false)} isOpen={isOpen}>
				<div className="w-full flex items-center justify-around p-7">
					<select
						value={selectedSubject}
						onChange={handleSubjectChange}
						className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color60 focus:border-transparent"
					>
						<option hidden value="">
							Select a Subject...
						</option>
						{uniqueSubjects.map((option) => (
							<option key={option.id} value={option.id}>
								{option.subject}
							</option>
						))}
					</select>
					<label htmlFor="vote">Vote:</label>
					<input
						id="vote"
						type="number"
						min="0"
						max="10"
						step="1"
						value={rating === null ? '' : rating}
						onChange={handleRatingChange}
						className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color60 focus:border-transparent"
					/>
				</div>
				{successfully && <div className="w-full text-center font-semibold text-contrast">
					Add Successfully!
				</div>}
				{(rating !== null && rating >= 0 && rating <= 10) && selectedSubject && (
				<div className="w-full flex justify-center">
					<button 
					    id={id} 
					    onClick={(e) => handleSubmit(e, date)}
						className="mt-4 bg-color60 hover:bg-color80 text-white font-bold py-2 px-4 rounded-lg transition-all">
						Send
					</button>
				</div>
				)}
			</ModalVote>
		</>
	);
}
