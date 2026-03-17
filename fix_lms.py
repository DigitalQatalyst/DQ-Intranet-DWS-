import sys

with open("src/pages/lms/LmsCourseDetailPage.tsx", "r") as f:
    lines = f.readlines()

replacement = """                        .map((item: any, curriculumIndex: number) => {
                          const isCourse = course.courseType === 'Course (Multi-Lessons)';
                          const isSingleLesson = course.courseType === 'Course (Single Lesson)';

                          if (isTrack) {
                            return (
                              <Link
                                key={item.id}
                                to={`/lms/${item.courseSlug}`}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden block hover:border-blue-500 hover:shadow-md transition-all group"
                              >
                                <div className="p-4 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                      <Library size={20} />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                      </h3>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-medium text-indigo-600">
                                          Course {curriculumIndex + 1}
                                        </span>
                                        {item.duration && (
                                          <>
                                            <span className="text-gray-300">·</span>
                                            <div className="flex items-center gap-1">
                                              <Clock size={12} className="text-gray-400" />
                                              <span>{item.duration}</span>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRightIcon size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                              </Link>
                            );
                          }

                          if (isCourse) {
                            if (item.topics && item.topics.length > 0) {
                              const hasMatchingTopicTitle = item.topics.some((topic: any) => topic.title === item.title);
                              const shouldShowSectionHeader = !hasMatchingTopicTitle && (item.topics.length > 1 || item.description);

                              return (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                  {shouldShowSectionHeader && (
                                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                      {item.description && (
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                      )}
                                    </div>
                                  )}

                                  <div className={shouldShowSectionHeader ? "divide-y divide-gray-200" : ""}>
                                    {item.topics
                                      .sort((a: any, b: any) => a.order - b.order)
                                      .map((topic: any, index: number) => {
                                        const isTopicExpanded = expandedTopics.has(topic.id);
                                        const toggleTopic = () => {
                                          setExpandedTopics(prev => {
                                            const next = new Set(prev);
                                            if (next.has(topic.id)) next.delete(topic.id);
                                            else next.add(topic.id);
                                            return next;
                                          });
                                        };

                                        const lessonCount = topic.lessons?.length || 0;
                                        const topicIndex = allTopics.findIndex((t: any) => t.topic.id === topic.id);
                                        const moduleNumber = topicIndex >= 0 ? topicIndex + 1 : index + 1;

                                        return (
                                          <div key={topic.id}>
                                            <div
                                              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                              onClick={toggleTopic}
                                            >
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FileText size={16} />
                                                  </div>
                                                  <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                      <h4 className="font-medium text-gray-900">{topic.title}</h4>
                                                      <span className="text-xs text-gray-500">
                                                        Module {moduleNumber}. {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                                <button className="ml-4 text-gray-400 hover:text-gray-600">
                                                  {isTopicExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                                                </button>
                                              </div>
                                            </div>

                                            {isTopicExpanded && topic.lessons && (
                                              <div className="bg-gray-50 pl-12 pr-4 py-3 space-y-2">
                                                {topic.lessons
                                                  .sort((a: any, b: any) => a.order - b.order)
                                                  .map((lesson: any) => {
                                                    const LessonIcon = getLessonTypeIcon(lesson.type);
                                                    return (
                                                      <div
                                                        key={lesson.id}
                                                        className={`p-3 rounded-lg border ${lesson.isLocked ? 'border-gray-200 opacity-60 bg-gray-50' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'}`}
                                                      >
                                                        <div className="flex items-start gap-3">
                                                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${lesson.isLocked ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                                                            {lesson.isLocked ? <Lock size={16} /> : <LessonIcon size={16} />}
                                                          </div>
                                                          <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                              <span className="text-xs font-medium text-gray-500">
                                                                Lesson {lesson.order}
                                                              </span>
                                                            </div>
                                                            <h5 className={`text-sm font-medium mb-1 ${lesson.isLocked ? 'text-gray-500' : 'text-gray-900'}`}>{lesson.title}</h5>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              );
                            }
                          }

                          if (isSingleLesson && item.lessons) {
                            return (
                              <div key={item.id} className="space-y-3">
                                {item.lessons
                                  .sort((a: any, b: any) => a.order - b.order)
                                  .map((lesson: any) => {
                                    const LessonIcon = getLessonTypeIcon(lesson.type);
                                    return (
                                      <div
                                        key={lesson.id}
                                        className={`bg-white border rounded-lg p-4 transition-all hover:border-blue-300 hover:shadow-sm cursor-pointer`}
                                      >
                                        <div className="flex items-start gap-4">
                                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600`}>
                                            <LessonIcon size={20} />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-sm font-medium text-gray-500">Lesson {lesson.order}</span>
                                            </div>
                                            <h3 className={`text-lg font-semibold mb-1 text-gray-900`}>{lesson.title}</h3>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            );
                          }

                          return null;
                        })}
"""

new_lines = lines[:732] + [replacement] + lines[1316:]

with open("src/pages/lms/LmsCourseDetailPage.tsx", "w") as f:
    f.writelines(new_lines)
