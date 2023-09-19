import { api } from '@/lib/axios'
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { FileVideo, Upload } from 'lucide-react'
import { ChangeEvent, useMemo, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
	converting: 'Convertendo...',
	generating: 'Transcrevendo...',
	uploading: 'Carregando...',
	success: 'Sucesso!',
}

export function VideInputForm() {
	const [videoFile, setVideoFile] = useState<File | null>(null)
	const promptInputRef = useRef<HTMLTextAreaElement>(null)
	const [status, setStatus] = useState<Status>('waiting')

	function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
		const { files } = event.currentTarget

		if (!files) {
			return
		}

		const selectedFile = files[0]

		setVideoFile(selectedFile)
	}

	async function convertVideoToAudio(video: File) {
		console.log('Convert started.')

		const ffmpeg = await getFFmpeg()

		await ffmpeg.writeFile('input.mp4', await fetchFile(video))

		// ffmpeg.on('log', log => {
		//   console.log(log)
		// })

		ffmpeg.on('progress', (progress) => {
			console.log('Convert progress: ' + Math.round(progress.progress * 100))
		})

		await ffmpeg.exec([
			'-i',
			'input.mp4',
			'-map',
			'0:a',
			'-b:a',
			'20k',
			'-acodec',
			'libmp3lame',
			'output.mp3',
		])

		// Converter FileData para File
		const data = await ffmpeg.readFile('output.mp3')

		const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })

		const audioFile = new File([audioFileBlob], 'audio.mp3', {
			type: 'audio/mpeg',
		})

		console.log('Convert finished.')

		return audioFile
	}

	async function handleUploadVideo(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const prompt = promptInputRef.current?.value

		if (!videoFile) {
			return
		}

		setStatus('converting')

		// Converter vídeo em audio
		const audioFile = await convertVideoToAudio(videoFile)

		// Criar um data par um formulário no tipo FormData
		const data = new FormData()

		// Campo file
		data.append('file', audioFile)

		setStatus('uploading')

		// Fazer a requisição para enviar um vídeo
		const response = await api.post('/videos', data)

		// Obter o ID do vídeo
		const videoId = response.data.video.id

		setStatus('generating')

		// Fazer a requisição para obter a transcrição do vídeo
		await api.post(`/videos/${videoId}/transcription`, {
			prompt,
		})

		setStatus('success')
		console.log('Finalizou')
	}

	const previewURL = useMemo(() => {
		if (!videoFile) {
			return null
		}

		return URL.createObjectURL(videoFile)
	}, [videoFile])

	return (
		<form onSubmit={handleUploadVideo} className="space-y-6 w-full">
			<label
				htmlFor="video"
				className="relative border w-full flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
			>
				{previewURL ? (
					<video
						src={previewURL}
						controls={false}
						className="pointer-events-none absolue inset-0 aspect-video"
					/>
				) : (
					<>
						<FileVideo className="w-4 h-4" />
						Selecione um video
					</>
				)}
			</label>

			<input
				type="file"
				name="video"
				id="video"
				accept="video/mp4"
				className="sr-only"
				onChange={handleFileSelected}
			/>

			<Separator orientation="horizontal" />

			<div className="space-y-2">
				<Label htmlFor="transcription_prompt">Prompt de descrição</Label>

				<Textarea
					ref={promptInputRef}
					disabled={status !== 'waiting'}
					id="transcription_prompt"
					className="h-20 leading-relaxed resize-none"
					placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
				/>
			</div>

			<Button
				data-success={status === 'success'}
				disabled={status !== 'waiting'}
				type="submit"
				className="w-full data-[success=true]:bg-emerald-400 data-[success=true]:text-white"
			>
				{status === 'waiting' ? (
					<>
						Carregar video
						<Upload className="w-4 h-4 ml-2" />
					</>
				) : (
					statusMessages[status]
				)}
			</Button>
		</form>
	)
}
