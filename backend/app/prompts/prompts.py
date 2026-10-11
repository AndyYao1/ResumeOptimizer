def parsePrompt(text: str) -> str:
    return f"""
        Extract structured resume data into JSON.

        Return ONLY valid JSON with no additional text with this schema:
        {{
        "name": "",
        "email": "",
        "phone": "",
        "location": "",
        "skills": {{}},
        "experience": [
            {{
            "company": "",
            "role": "",
            "dates": "",
            "bullets": []
            }}
        ],
        "projects": [
            {{
            "name": "",
            "bullets": []
            }}
        ],
        "education": [
            {{
            "school": "",
            "degree": "",
            "gpa": "",
            "dates": ""
            }}
        ]
        }}

        Skills MUST be grouped into categories like:
        - Programming
        - Databases
        - Frameworks
        - Tools

        Example:
        "skills": {{
        "Programming": ["Python", "C++"],
        "Databases": ["MySQL", "MongoDB"]
        }}

        Resume:
        {text}
        """

def sharedContext(job_description: str) -> str:
    return f"""
        Job description:
        {job_description}

        You are an expert technical resume writer specializing in ATS-optimized software engineering resumes.
        When rewriting bulletpoints or writing application answers, maintain a natural, human-like tone so 
        each sentence is something a candidate would say out loud. Do NOT invent experience.

        Return ONLY valid JSON. Do not include markdown. Do not include explanations.
        Do not include code fences. Do not add additional sections.
    """

def generatePrompt(bullets: str, job_description: str) -> str:
    return f"""
        {sharedContext(job_description)}

        Rules:
        - Each bullet must begin with a strong action verb
        - Each bullet must be one sentence
        - Maximum 30 words per bullet
        - Preserve technologies already present
        - Emphasize impact and measurable outcomes
        - Do not use first person pronouns

        Rewrite the provided bullet points to be strong, metric-driven, and better align with the job description.
        The response MUST follow this exact schema:
        {{
            "bullets": ["string"]
        }}

        Bullets:
        {bullets}
        """

def reorderSkillsPrompt(skills: dict, job_description: str) -> str:
    return f"""
        {sharedContext(job_description)}

        Given a list of categories and skills, reorder the skills for each category in order of relevance.
        Return the valid JSON in the same format. 

        Skills:
        {skills}
        """

def generateApplicationAnswersPrompt(resume: dict, questions: list, job_description: str) -> str:
    return f"""
        {sharedContext(job_description)}

        For each question, write an answer that aligns with the resume's skills, experience, and
        job description. The answers should be strong, concise, and indicate that the candidate is 
        a strong fit for the job.

        The response MUST follow this schema:
        {{
            "answers": ["answer1","answer2",..]
        }}

        Questions:
        {questions}

        Resume:
        {resume}
        """