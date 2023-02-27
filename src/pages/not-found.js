const NotFoundPage = () => (
    <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
        <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
                <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">
                    Video not found!!
                </div>
            </div>
            <div className="text-center mt-4">
                <a href="/app/videos" className="text-primary hover:opacity-75">Back to videos</a>
            </div>
        </div>
    </div>
)

export default NotFoundPage
