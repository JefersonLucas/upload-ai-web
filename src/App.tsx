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
import { FileVideo, Github, Upload, UploadCloud, Wand2 } from 'lucide-react'
import { Button } from './components/ui/button'

export function App() {
	return (
		<div className="min-h-screen flex flex-col">
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
							className="resize-none p-4 leading-relaxed"
						/>
						<Textarea
							placeholder="Resultado gerado pela IA"
							readOnly
							className="resize-none p-4 leading-relaxed"
						/>
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
					<form className="space-y-6 w-full">
						<label
							htmlFor="video"
							className="border w-full flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
						>
							<FileVideo className="w-4 h-4" />
							Selecione um video
						</label>

						<input
							type="file"
							name="video"
							id="video"
							accept="video/mp4"
							className="sr-only"
						/>

						<Separator orientation="horizontal" />

						<div className="space-y-2">
							<Label htmlFor="transcription_prompt">Prompt de descrição</Label>

							<Textarea
								id="transcription_prompt"
								className="h-20 leading-relaxed resize-none"
								placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
							/>
						</div>

						<Button type="submit" className="w-full">
							Carregar vídeo
							<Upload className="w-4 h-4 ml-2" />
						</Button>
					</form>

					<Separator />

					{/* Form 02 */}
					<form className="space-y-6">
						<div className="space-y-2">
							<Label>Prompt</Label>

							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Selecione um prompt..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="title">Título do YouTube</SelectItem>
									<SelectItem value="description">
										Descrição do YouTube
									</SelectItem>
								</SelectContent>
							</Select>
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

							<Slider min={0} max={100} step={0.1} />

							<span className="block text-sm italic text-muted-foreground leading-relaxed">
								Valores mais altos tendem a deixar o resultado mais criativo e
								com possíveis erros.
							</span>
						</div>

						<Separator />

						<Button type="submit" className="w-full">
							Executar <Wand2 className="w-4 h-4 ml-2" />
						</Button>
					</form>
				</aside>
			</main>
		</div>
	)
}
