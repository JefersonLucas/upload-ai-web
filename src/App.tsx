import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useCompletion } from 'ai/react'
import { Clipboard, Github, UploadCloud, Wand2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { PromptSelect } from './components/prompt-select'
import { Button } from './components/ui/button'
import { VideoInputForm } from './components/video-input-form'

export function App() {
	const [temperature, setTemperature] = useState(0.5)
	const [videoId, setVideoId] = useState<string | null>(null)
	const [textCopied, setTextCopied] = useState<string | null>(null)
	const textToCopyRef = useRef<HTMLTextAreaElement | null>(null)

	function handleCopyText() {
		if (textToCopyRef.current) {
			// Seleciona o elemento de texto para copiar
			textToCopyRef.current.select()

			// Copia o texto para a área de transferência
			document.execCommand('copy')

			// Atualiza o estado para indicar que o texto foi copiado
			setTextCopied('Copiado!')

			// Limpa a mensagem após alguns segundos
			setTimeout(() => {
				setTextCopied(null)
			}, 2000)
		}
	}

	const {
		input,
		setInput,
		handleInputChange,
		handleSubmit,
		completion,
		isLoading,
	} = useCompletion({
		api: 'http://localhost:3333/ai/complete',
		body: {
			videoId,
			temperature,
		},
		headers: {
			'Content-Type': 'application/json',
		},
	})

	return (
		<div className="min-h-screen flex flex-col select-none">
			{/* Header */}
			<header className="px-6 py-3 flex items-center justify-between border-b">
				<h1 className="text-xl font-bold font-mono flex items-center gap-2">
					<UploadCloud className="w-8 h-8 text-violet-500" />
					upload.ai
				</h1>

				{/* CTA */}
				<div className="flex items-center gap-3">
					<span className="text-sm text-muted-foreground">
						Desenvolvido com 💜 no NLW da Rocketseat
					</span>

					<Separator orientation="vertical" className="h-6" />

					<a
						href="https://github.com/JefersonLucas/upload-ai-web"
						target="_blank"
					>
						<Button variant="outline">
							<Github className="w-4 h-4 mr-2" />
							Github
						</Button>
					</a>
				</div>
			</header>

			{/* Main */}
			<main className="flex-1 relative overflow-hidden pr-96 p-6 flex gap-6">
				{/* Textareas */}
				<div className="flex flex-col flex-1 gap-4">
					<div className="grid grid-rows-2 gap-4 flex-1">
						<Textarea
							placeholder="Inclua o promp para IA..."
							className="resize-none p-4 leading-relaxed scrollbar px-2 scrollbar-thin scrollbar-track-violet-900/5 scrollbar-thumb-violet-600/5"
							value={input}
							onChange={handleInputChange}
						/>
						<div className="relative">
							<Textarea
								placeholder="Resultado gerado pela IA"
								readOnly
								ref={textToCopyRef}
								className="resize-none p-4 leading-relaxed h-full"
								value={completion}
							/>
							<Button
								disabled={!completion}
								onClick={handleCopyText}
								variant="ghost"
								className="absolute bottom-4 right-4"
							>
								<Clipboard className="w-4 h-4 mr-2" />
								{textCopied ? textCopied : 'Copiar'}
							</Button>
						</div>
					</div>
					{/* Tips */}
					<p className="text-sm text-muted-foreground">
						Lembre-se: você pode utilizar a variável{' '}
						<code className="text-violet-700 font-mono">
							{'{transcription}'}
						</code>{' '}
						no seu prompt para adicionar o conteúdo da transcrição do vídeo
						selecionado.
					</p>
				</div>

				{/* Aside */}
				<aside className="w-80 absolute top-6 bottom-6 right-6 overflow-y-scroll scrollbar px-2 scrollbar-thin scrollbar-track-violet-900/5 scrollbar-thumb-violet-600/5 space-y-6">
					{/* Form 01 */}
					<VideoInputForm onVideoUploaded={setVideoId} />

					<Separator />

					{/* Form 02 */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label>Prompt</Label>

							<PromptSelect onPromptSelected={setInput} />
						</div>

						<div className="space-y-2">
							<Label>Modelo</Label>

							<Select defaultValue="gpt3.5" disabled>
								<SelectTrigger>
									<SelectValue placeholder="Modelo" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="gpt3.5">GPT 3.5-Turbo 16k</SelectItem>
								</SelectContent>
							</Select>

							<span className="block text-sm italic text-muted-foreground">
								Você poderá customizar essa opção em breve.
							</span>
						</div>

						<Separator />

						<div className="space-y-4">
							<Label>Temperatura</Label>

							<Slider
								min={0}
								max={1}
								step={0.1}
								value={[temperature]}
								onValueChange={(value) => setTemperature(value[0])}
							/>

							<span className="block text-sm italic text-muted-foreground leading-relaxed">
								Valores mais altos tendem a deixar o resultado mais criativo e
								com possíveis erros.
							</span>
						</div>

						<Separator />

						<Button disabled={isLoading} type="submit" className="w-full">
							Executar <Wand2 className="w-4 h-4 ml-2" />
						</Button>
					</form>
				</aside>
			</main>
		</div>
	)
}
