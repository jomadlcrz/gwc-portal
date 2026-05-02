import { STUDENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderPortalShell } from '../../../components/layout/_layout'

export function renderstudent_grades_page(): string {
  return renderPortalShell(
    STUDENT_SHELL_CONFIG,
    'grades',
    `
      <section class="student-content">
        ${renderBreadcrumbNav([
          { label: 'Grades', active: true },
        ])}

        <article class="student-panel student-grades-panel">
          <div class="accordion accordion-flush" id="studentGradesAccordion">
            <section class="accordion-item">
              <h2 class="accordion-header" id="gradesHeadingSecondSem">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#gradesCollapseSecondSem"
                  aria-expanded="false"
                  aria-controls="gradesCollapseSecondSem"
                >
                  ACADEMIC YEAR 2025-2026 2ND SEMESTER
                </button>
              </h2>
              <div
                id="gradesCollapseSecondSem"
                class="accordion-collapse collapse"
                aria-labelledby="gradesHeadingSecondSem"
              >
                <div class="accordion-body student-grades-accordion-body">
                  <div class="table-responsive student-grades-table-wrap">
                    <table class="table table-striped table-bordered table-sm student-grades-table">
                      <thead>
                        <tr>
                          <th colspan="10" class="student-grades-class-head">REGULAR CLASS</th>
                        </tr>
                        <tr>
                          <th>#</th>
                          <th>Set</th>
                          <th>Subject Code</th>
                          <th>Descriptive Title</th>
                          <th>Prelim</th>
                          <th>Midterm</th>
                          <th>Semi Final</th>
                          <th>Finals</th>
                          <th>Final Grade</th>
                          <th>Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>A1</td>
                          <td>IT101</td>
                          <td>Introduction to Computing</td>
                          <td>91</td>
                          <td>90</td>
                          <td>92</td>
                          <td>93</td>
                          <td>92</td>
                          <td>PASSED</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>A1</td>
                          <td>IT201</td>
                          <td>Data Structures and Algorithms</td>
                          <td>90</td>
                          <td>91</td>
                          <td>90</td>
                          <td>92</td>
                          <td>91</td>
                          <td>PASSED</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>A1</td>
                          <td>IT203</td>
                          <td>Human Computer Interaction</td>
                          <td>89</td>
                          <td>88</td>
                          <td>90</td>
                          <td>90</td>
                          <td>89</td>
                          <td>PASSED</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>A1</td>
                          <td>IT205</td>
                          <td>Information Management</td>
                          <td>93</td>
                          <td>92</td>
                          <td>94</td>
                          <td>95</td>
                          <td>94</td>
                          <td>PASSED</td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>A1</td>
                          <td>GE09</td>
                          <td>Life and Works of Rizal</td>
                          <td>87</td>
                          <td>88</td>
                          <td>89</td>
                          <td>90</td>
                          <td>89</td>
                          <td>PASSED</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <section class="accordion-item">
              <h2 class="accordion-header" id="gradesHeadingFirstSem">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#gradesCollapseFirstSem"
                  aria-expanded="false"
                  aria-controls="gradesCollapseFirstSem"
                >
                  ACADEMIC YEAR 2025-2026 1ST SEMESTER
                </button>
              </h2>
              <div
                id="gradesCollapseFirstSem"
                class="accordion-collapse collapse"
                aria-labelledby="gradesHeadingFirstSem"
              >
                <div class="accordion-body student-grades-accordion-body">
                  <div class="table-responsive student-grades-table-wrap">
                    <table class="table table-striped table-bordered table-sm student-grades-table">
                      <thead>
                        <tr>
                          <th colspan="10" class="student-grades-class-head">IRREGULAR CLASS</th>
                        </tr>
                        <tr>
                          <th>#</th>
                          <th>Set</th>
                          <th>Subject Code</th>
                          <th>Descriptive Title</th>
                          <th>Prelim</th>
                          <th>Midterm</th>
                          <th>Semi Final</th>
                          <th>Finals</th>
                          <th>Final Grade</th>
                          <th>Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>B2</td>
                          <td>IT102</td>
                          <td>Computer Programming 1</td>
                          <td>88</td>
                          <td>89</td>
                          <td>90</td>
                          <td>91</td>
                          <td>90</td>
                          <td>PASSED</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>B2</td>
                          <td>IT104</td>
                          <td>Discrete Mathematics</td>
                          <td>84</td>
                          <td>86</td>
                          <td>85</td>
                          <td>87</td>
                          <td>86</td>
                          <td>PASSED</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>C1</td>
                          <td>IT106</td>
                          <td>Web Systems and Technologies</td>
                          <td>90</td>
                          <td>91</td>
                          <td>92</td>
                          <td>91</td>
                          <td>91</td>
                          <td>PASSED</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>C1</td>
                          <td>NSTP1</td>
                          <td>National Service Training Program 1</td>
                          <td>92</td>
                          <td>93</td>
                          <td>92</td>
                          <td>94</td>
                          <td>93</td>
                          <td>PASSED</td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>C1</td>
                          <td>PE1</td>
                          <td>Physical Fitness and Wellness</td>
                          <td>95</td>
                          <td>94</td>
                          <td>95</td>
                          <td>96</td>
                          <td>95</td>
                          <td>PASSED</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </article>
      </section>
    `,
  )
}


